import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Users,
  ArrowRight,
  RotateCcw,
  Zap,
  Info,
  X,
  Check
} from 'lucide-react';
import {
  useAuth,
  getUserAvailability,
  saveUserAvailability,
  toggleDayAvailability,
  addAvailabilitySlot,
  removeAvailabilitySlot,
  DEFAULT_WEEKLY_AVAILABILITY
} from '../utils/auth.js';
import './Availability.css';

const Availability = () => {
  const { availability, saveUserAvailability: updateAvailabilityInAuth } = useAuth();
  const [weeklySchedule, setWeeklySchedule] = useState(availability);

  // Selected sticker slot state
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  // Slot modal state
  const [activeDayForModal, setActiveDayForModal] = useState(null);
  const [slotStart, setSlotStart] = useState('16:00');
  const [slotEnd, setSlotEnd] = useState('18:00');
  const [slotPeriod, setSlotPeriod] = useState('Evening Study');

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Convert 24h time to 12h label
  const formatTimeLabel = (start24, end24) => {
    const to12 = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      const suffix = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      const mStr = m < 10 ? `0${m}` : m;
      return `${h12}:${mStr} ${suffix}`;
    };
    return `${to12(start24)} – ${to12(end24)}`;
  };

  // Calculate statistics
  const activeDaysCount = weeklySchedule.filter((d) => d.enabled && d.slots.length > 0).length;
  const totalSlotsCount = weeklySchedule.reduce((acc, d) => acc + (d.enabled ? d.slots.length : 0), 0);

  // Approximate weekly hours calculation
  const totalHours = weeklySchedule.reduce((total, day) => {
    if (!day.enabled) return total;
    const dayHours = day.slots.reduce((slotTotal, slot) => {
      const [sh, sm] = (slot.start || '16:00').split(':').map(Number);
      const [eh, em] = (slot.end || '18:00').split(':').map(Number);
      const diffHours = (eh * 60 + em - (sh * 60 + sm)) / 60;
      return slotTotal + Math.max(diffHours, 0.5);
    }, 0);
    return total + dayHours;
  }, 0);

  // Identify overlapping slots per day
  const overlappingSlotIds = useMemo(() => {
    const set = new Set();
    weeklySchedule.forEach((day) => {
      if (!day.enabled || !day.slots || day.slots.length < 2) return;
      const slots = day.slots;
      for (let i = 0; i < slots.length; i++) {
        for (let j = i + 1; j < slots.length; j++) {
          const s1 = slots[i];
          const s2 = slots[j];
          if (s1.start && s1.end && s2.start && s2.end) {
            // Overlap condition
            if (s1.start < s2.end && s2.start < s1.end) {
              set.add(s1.id);
              set.add(s2.id);
            }
          }
        }
      }
    });
    return set;
  }, [weeklySchedule]);

  // Toggle Day
  const handleToggleDay = (dayName) => {
    const updated = weeklySchedule.map((d) => {
      if (d.day === dayName) {
        return { ...d, enabled: !d.enabled };
      }
      return d;
    });
    setWeeklySchedule(updated);
    saveUserAvailability(updated);
    showToast(`Updated availability for ${dayName}.`);
  };

  // Remove Slot
  const handleRemoveSlot = (dayName, slotId, e) => {
    if (e) e.stopPropagation();
    const updated = weeklySchedule.map((d) => {
      if (d.day === dayName) {
        const remaining = d.slots.filter((s) => s.id !== slotId);
        return {
          ...d,
          slots: remaining,
          enabled: remaining.length > 0 ? d.enabled : false
        };
      }
      return d;
    });
    setWeeklySchedule(updated);
    saveUserAvailability(updated);
    if (selectedSlotId === slotId) setSelectedSlotId(null);
    showToast(`Time slot removed from ${dayName}.`);
  };

  // Toggle Slot Selection
  const handleSlotClick = (slotId) => {
    setSelectedSlotId((prev) => (prev === slotId ? null : slotId));
  };

  // Open Add Slot Modal
  const handleOpenAddModal = (dayName) => {
    setActiveDayForModal(dayName);
    setSlotStart('16:00');
    setSlotEnd('18:00');
    setSlotPeriod('Peer Study Slot');
  };

  // Submit Add Slot
  const handleAddSlotSubmit = (e) => {
    e.preventDefault();
    if (!activeDayForModal) return;

    const label = formatTimeLabel(slotStart, slotEnd);
    const newSlot = {
      id: `slot_${Date.now()}`,
      start: slotStart,
      end: slotEnd,
      label,
      period: slotPeriod.trim() || 'Free Study Window'
    };

    const updated = weeklySchedule.map((d) => {
      if (d.day === activeDayForModal) {
        return {
          ...d,
          enabled: true,
          slots: [...(d.slots || []), newSlot]
        };
      }
      return d;
    });

    setWeeklySchedule(updated);
    saveUserAvailability(updated);
    setActiveDayForModal(null);
    setSelectedSlotId(newSlot.id);
    showToast(`New time slot added to ${activeDayForModal}!`);
  };

  // Presets
  const applyPreset = (presetType) => {
    let newSchedule = JSON.parse(JSON.stringify(DEFAULT_WEEKLY_AVAILABILITY));

    if (presetType === 'evenings') {
      newSchedule = newSchedule.map((d) => {
        const isWeekday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(d.day);
        return {
          ...d,
          enabled: isWeekday,
          slots: isWeekday
            ? [
                {
                  id: `slot_${d.day}_eve`,
                  start: '17:00',
                  end: '19:00',
                  label: '5:00 PM – 7:00 PM',
                  period: 'Weekday Evening'
                }
              ]
            : []
        };
      });
      showToast('Applied "Weekday Evenings" preset (5 PM – 7 PM).');
    } else if (presetType === 'weekends') {
      newSchedule = newSchedule.map((d) => {
        const isWeekend = ['Saturday', 'Sunday'].includes(d.day);
        return {
          ...d,
          enabled: isWeekend,
          slots: isWeekend
            ? [
                {
                  id: `slot_${d.day}_morn`,
                  start: '10:00',
                  end: '13:00',
                  label: '10:00 AM – 1:00 PM',
                  period: 'Weekend Morning'
                }
              ]
            : []
        };
      });
      showToast('Applied "Weekend Focus" preset (10 AM – 1 PM).');
    } else if (presetType === 'default') {
      newSchedule = JSON.parse(JSON.stringify(DEFAULT_WEEKLY_AVAILABILITY));
      showToast('Reset to standard student timetable.');
    } else if (presetType === 'clear') {
      newSchedule = newSchedule.map((d) => ({
        ...d,
        enabled: false,
        slots: []
      }));
      showToast('Cleared all availability slots.');
    }

    setWeeklySchedule(newSchedule);
    saveUserAvailability(newSchedule);
  };

  return (
    <div className="avail-page">
      <div className="container">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="app-toast-alert">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="avail-header">
          <span className="avail-kicker">
            <Clock size={14} />
            <span>Weekly Schedule Planner</span>
          </span>
          <h1 className="avail-title">My Weekly Availability</h1>
          <p className="avail-subtitle">
            Configure the days and times you are free to teach or learn. 4S cross-references your available slots with fellow campus students to compute compatibility scores and prevent scheduling conflicts.
          </p>
        </div>

        {/* Quick Metrics Row */}
        <div className="avail-metrics-row">
          <div className="avail-metric-card">
            <div className="avail-metric-info">
              <h4>Active Days</h4>
              <div className="avail-metric-number">{activeDaysCount} of 7</div>
            </div>
            <div className="avail-metric-icon bg-indigo-50 text-indigo-600">
              <Calendar size={22} />
            </div>
          </div>

          <div className="avail-metric-card">
            <div className="avail-metric-info">
              <h4>Configured Slots</h4>
              <div className="avail-metric-number">{totalSlotsCount} time blocks</div>
            </div>
            <div className="avail-metric-icon bg-purple-50 text-purple-600">
              <Clock size={22} />
            </div>
          </div>

          <div className="avail-metric-card">
            <div className="avail-metric-info">
              <h4>Weekly Study Hours</h4>
              <div className="avail-metric-number">~{totalHours.toFixed(1)} hrs</div>
            </div>
            <div className="avail-metric-icon bg-emerald-50 text-emerald-600">
              <Zap size={22} />
            </div>
          </div>
        </div>

        {/* Presets Toolbar */}
        <div className="avail-toolbar">
          <div className="avail-presets-group">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 mr-2">
              Quick Presets:
            </span>
            <button
              onClick={() => applyPreset('evenings')}
              className="preset-chip"
              title="Set weekday evenings (5 PM – 7 PM)"
            >
              🌙 Weekday Evenings
            </button>
            <button
              onClick={() => applyPreset('weekends')}
              className="preset-chip"
              title="Set weekend mornings (10 AM – 1 PM)"
            >
              ☀️ Weekend Mornings
            </button>
            <button
              onClick={() => applyPreset('default')}
              className="preset-chip"
              title="Reset to default college schedule"
            >
              <RotateCcw size={13} />
              <span>Standard Schedule</span>
            </button>
            <button
              onClick={() => applyPreset('clear')}
              className="preset-chip text-rose-600 hover:text-rose-700"
              title="Clear all availability"
            >
              <Trash2 size={13} />
              <span>Clear All</span>
            </button>
          </div>

          <div>
            <Link to="/sessions" className="btn btn-outline" style={{ padding: '0.45rem 0.85rem' }}>
              <Calendar size={15} />
              <span>View Scheduled Sessions</span>
            </Link>
          </div>
        </div>

        {/* Weekly Calendar Grid (Mon to Sun) */}
        <div className="weekly-calendar-grid">
          {weeklySchedule.map((dayItem) => {
            const hasSlots = dayItem.slots && dayItem.slots.length > 0;
            const isEnabled = dayItem.enabled && hasSlots;

            return (
              <div
                key={dayItem.day}
                className={`day-card ${!dayItem.enabled ? 'day-disabled' : ''}`}
              >
                <div className="day-card-header">
                  <div className="day-title-group">
                    <div
                      className={`day-badge ${
                        isEnabled ? 'day-badge-active' : 'day-badge-inactive'
                      }`}
                    >
                      {dayItem.dayShort || dayItem.day.slice(0, 3)}
                    </div>
                    <div>
                      <span className="day-name">{dayItem.day}</span>
                      <span className="day-status-text">
                        {dayItem.enabled
                          ? hasSlots
                            ? `${dayItem.slots.length} time slot${dayItem.slots.length > 1 ? 's' : ''} available`
                            : 'Marked available (No slots defined)'
                          : 'Unavailable / Off-day'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="switch-label">
                      <input
                        type="checkbox"
                        className="switch-input"
                        checked={dayItem.enabled}
                        onChange={() => handleToggleDay(dayItem.day)}
                      />
                      <span className="switch-slider"></span>
                      <span className="text-xs font-bold text-slate-700">
                        {dayItem.enabled ? 'Available' : 'Unavailable'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Slots List: Outlined Stickers with Hover Lift & Yellow Sparkle Fill */}
                <div className="slots-container">
                  {hasSlots ? (
                    dayItem.slots.map((slot) => {
                      const isSelected = selectedSlotId === slot.id;
                      const isOverlapping = overlappingSlotIds.has(slot.id);
                      const isHighlighted = isSelected || isOverlapping;

                      return (
                        <div
                          key={slot.id}
                          className={`slot-sticker ${isHighlighted ? 'slot-sticker-active' : ''}`}
                          onClick={() => handleSlotClick(slot.id)}
                          title={
                            isOverlapping
                              ? 'Overlapping slot detected! Click to highlight or review.'
                              : 'Click slot sticker to select'
                          }
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleSlotClick(slot.id);
                            }
                          }}
                        >
                          {/* Check Sparkle badge for selected or overlapping slots */}
                          {isHighlighted ? (
                            <span className="sticker-sparkle-badge" aria-label="Selected slot check sparkle">
                              <Sparkles size={13} className="text-amber-600 fill-amber-500 animate-spin-slow" />
                              <Check size={11} className="text-slate-900 stroke-[3]" />
                            </span>
                          ) : (
                            <Clock size={14} className="text-indigo-600 flex-shrink-0" />
                          )}

                          <span className="slot-time">{slot.label}</span>

                          {slot.period && (
                            <span className="slot-period-tag">{slot.period}</span>
                          )}

                          {isOverlapping && (
                            <span className="slot-overlap-indicator">Overlap</span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => handleRemoveSlot(dayItem.day, slot.id, e)}
                            className="slot-delete-btn"
                            title="Remove time slot"
                            aria-label={`Remove slot ${slot.label}`}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <span className="no-slots-notice">
                      {dayItem.enabled
                        ? 'No slots configured for this day. Click "+ Add Time Slot" to define your free window.'
                        : 'Day is toggled off.'}
                    </span>
                  )}

                  {/* Add Slot Button */}
                  {dayItem.enabled && (
                    <button
                      onClick={() => handleOpenAddModal(dayItem.day)}
                      className="add-slot-btn"
                    >
                      <Plus size={14} />
                      <span>Add Slot</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Matching System Impact Card */}
        <div className="matches-impact-card">
          <div className="impact-content">
            <div className="flex items-center gap-2 mb-2 text-indigo-300">
              <Sparkles size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">
                How Availability Powers 4S
              </span>
            </div>
            <h3>Smarter Peer Matching & Zero Scheduling Hassles</h3>
            <p>
              When campus peers browse skills on the Explore page or request a study session, your active timetable ensures sessions are booked during mutually convenient hours. Compatible students who share your free windows receive a higher compatibility score on your Matches page.
            </p>
          </div>

          <div className="flex flex-col gap-2.5" style={{ flexShrink: 0 }}>
            <Link to="/matches" className="btn btn-primary" style={{ backgroundColor: '#ffffff', color: '#1e1b4b' }}>
              <Users size={16} />
              <span>Explore Compatible Matches</span>
            </Link>
            <Link to="/sessions" className="btn btn-outline" style={{ color: '#ffffff', borderColor: '#6366f1' }}>
              <Calendar size={16} />
              <span>Go to Sessions</span>
            </Link>
          </div>
        </div>

        {/* Modal: Add Time Slot */}
        {activeDayForModal && (
          <div className="modal-overlay">
            <div className="modal-dialog" style={{ maxWidth: '440px' }}>
              <div className="modal-header">
                <h3 className="font-bold text-lg">Add Free Slot for {activeDayForModal}</h3>
                <button
                  className="modal-close-btn"
                  onClick={() => setActiveDayForModal(null)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddSlotSubmit}>
                <div className="modal-body">
                  <div className="form-group-row mb-4">
                    <div className="form-group">
                      <label className="form-label font-bold">Start Time</label>
                      <input
                        type="time"
                        className="form-control"
                        value={slotStart}
                        onChange={(e) => setSlotStart(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label font-bold">End Time</label>
                      <input
                        type="time"
                        className="form-control"
                        value={slotEnd}
                        onChange={(e) => setSlotEnd(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group mb-2">
                    <label className="form-label font-bold">Slot Label / Description</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. After Lectures, Lab Free Time, Morning Study"
                      value={slotPeriod}
                      onChange={(e) => setSlotPeriod(e.target.value)}
                    />
                  </div>

                  <p className="text-xs text-muted mt-2">
                    Preview:{' '}
                    <strong className="text-slate-800">
                      {formatTimeLabel(slotStart, slotEnd)}
                    </strong>
                  </p>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setActiveDayForModal(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <CheckCircle2 size={16} />
                    <span>Save Slot</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Availability;
