// Full-color illustrations for the five school areas and every high-school course.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const files = {
  physics: 'physics', chemistry: 'chemistry', biology: 'biology', earth: 'earth', society: 'society',
  '10통과1': 'integrated-1', '10통과2': 'integrated-2', '10과탐1': 'inquiry-1', '10과탐2': 'inquiry-2',
  '12물리': 'physics-course', '12화학': 'chemistry-course', '12생과': 'biology-course', '12지구': 'earth-course',
  '12역학': 'mechanics', '12전자': 'quantum', '12물에': 'matter-energy', '12반응': 'reactions',
  '12세포': 'metabolism', '12유전': 'genetics', '12지시': 'earth-system', '12행우': 'astronomy',
  '12과사': 'history-culture', '12기환': 'climate', '12융탐': 'convergent-inquiry'
};
const images = Object.fromEntries(Object.entries(files).map(([id, name]) => {
  const relative = 'assets/catalog-icons/v2/' + name + '.webp';
  const bytes = fs.readFileSync(path.resolve(__dirname, '../learning/inquiry/science-lab', relative));
  const hash = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 12);
  return [id, relative + '?v=' + hash];
}));
module.exports = function catalogIcon(id) {
  if (!Object.hasOwn(images, id)) throw new Error('Missing science catalog icon: ' + id);
  return '<img class="subject-icon" src="' + images[id] + '" width="48" height="48" alt="" aria-hidden="true" loading="lazy" decoding="async">';
};
