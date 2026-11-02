const fs = require('fs');
const pages = [
  'Login', 'Register', 'Dashboard', 'ExploreSkills', 'MySkills',
  'LearningRequests', 'Matches', 'Sessions', 'Messages', 'Achievements', 'Profile'
];

pages.forEach(page => {
  const content = `import React from 'react';

const ${page} = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">${page.replace(/([A-Z])/g, ' $1').trim()}</h1>
      <div className="card">
        <p className="text-muted">This is a placeholder page for the ${page.replace(/([A-Z])/g, ' $1').trim()} feature.</p>
      </div>
    </div>
  );
};

export default ${page};
`;
  fs.writeFileSync(`./src/pages/${page}.jsx`, content);
});
console.log('Pages generated');
