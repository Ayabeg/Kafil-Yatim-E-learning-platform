export const courses = [
  { id: 'confidence', title: 'Prendre confiance en soi', category: 'Épanouissement', level: 'Débutant', duration: '3 h 20', lessons: 8, rating: '4.9', students: '1 240' },
  { id: 'time', title: 'Mon temps, mon allié', category: 'Organisation', level: 'Débutant', duration: '2 h 10', lessons: 6, rating: '4.8', students: '920' },
  { id: 'goals', title: 'Passer de l’idée à l’action', category: 'Projets & avenir', level: 'Intermédiaire', duration: '4 h 05', lessons: 10, rating: '4.9', students: '780' },
  { id: 'emotions', title: 'Apprivoiser ses émotions', category: 'Bien-être', level: 'Tous niveaux', duration: '2 h 45', lessons: 7, rating: '4.7', students: '1 560' },
];

export function findCourse(courseId) {
  return courses.find((course) => course.id === courseId);
}
