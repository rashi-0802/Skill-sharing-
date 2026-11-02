/**
 * Anime / Manga Academy Theme
 * Skill Category Accent Colours:
 * Electric Blue (#3A86FF), Rose Pink (#FF8FB1), Sunrise Yellow (#FFD23F),
 * Success Teal (#2EC4B6), Highlight Red (#FF4D6D)
 */

export const CATEGORY_ACCENT_COLORS = {
  'Programming': '#3A86FF',      // Electric Blue
  'C': '#3A86FF',                // Electric Blue
  'Python': '#FFD23F',           // Sunrise Yellow
  'Web Development': '#2EC4B6',  // Success Teal
  'UI/UX Design': '#FF8FB1',     // Rose Pink
  'Graphic Design': '#FF4D6D',   // Highlight Red
  'Data Science': '#FFD23F',     // Sunrise Yellow
  'Photography': '#FF8FB1',      // Rose Pink
  'Communication': '#3A86FF',    // Electric Blue
  'Engineering & Tech': '#3A86FF',
  'Design & Creative': '#FF8FB1',
  'Career & Communication': '#2EC4B6'
};

export const PALETTE = ['#3A86FF', '#FF8FB1', '#FFD23F', '#2EC4B6', '#FF4D6D'];

export const getCategoryAccentColor = (category, index = 0) => {
  if (!category) return PALETTE[index % PALETTE.length];
  return CATEGORY_ACCENT_COLORS[category] || PALETTE[index % PALETTE.length];
};
