import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Compass,
  Crown,
  Flame,
  HeartHandshake,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  Play,
  Search,
  Settings,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  X,
  Zap,
} from 'lucide-react';
import './styles.css';

const image = (id, params = '') => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85${params}`;

const courses = [
  {
    id: 'confidence',
    title: 'Prendre confiance en soi',
    category: 'Épanouissement',
    level: 'Débutant',
    duration: '3 h 20',
    lessons: 8,
    rating: '4.9',
    students: '1 240',
    progress: 68,
    accent: 'coral',
    image: image('photo-1522202176988-66273c2fd55f'),
    description: 'Des outils simples et concrets pour oser prendre sa place et avancer avec confiance.',
    teacher: 'Nadia Benali',
    role: 'Coach en développement personnel',
    lessonsList: ['Bienvenue dans le parcours', 'Comprendre sa voix intérieure', 'Le pouvoir des petits pas', 'S’exprimer avec assurance', 'Créer son plan de confiance', 'Célébrer ses progrès'],
  },
  {
    id: 'time',
    title: 'Mon temps, mon allié',
    category: 'Organisation',
    level: 'Débutant',
    duration: '2 h 10',
    lessons: 6,
    rating: '4.8',
    students: '920',
    progress: 34,
    accent: 'yellow',
    image: image('photo-1499750310107-5fef28a66643'),
    description: 'Construis une organisation qui te laisse du temps pour ce qui compte vraiment.',
    teacher: 'Yanis Haddad',
    role: 'Mentor & facilitateur',
    lessonsList: ['Ton temps est précieux', 'Choisir ses priorités', 'La méthode des 25 minutes', 'Dire oui, dire non', 'Ta semaine idéale', 'Le défi 7 jours'],
  },
  {
    id: 'goals',
    title: 'Passer de l’idée à l’action',
    category: 'Projets & avenir',
    level: 'Intermédiaire',
    duration: '4 h 05',
    lessons: 10,
    rating: '4.9',
    students: '780',
    progress: 0,
    accent: 'green',
    image: image('photo-1516321318423-f06f85e504b3'),
    description: 'Transforme une envie en projet grâce à une méthode claire, joyeuse et réaliste.',
    teacher: 'Meriem Saïdi',
    role: 'Entrepreneure sociale',
    lessonsList: ['Ton idée mérite une chance', 'Dessiner la vision', 'Découper pour avancer', 'Les alliés du projet', 'Tester sans avoir peur', 'Apprendre du terrain'],
  },
  {
    id: 'emotions',
    title: 'Apprivoiser ses émotions',
    category: 'Bien-être',
    level: 'Tous niveaux',
    duration: '2 h 45',
    lessons: 7,
    rating: '4.7',
    students: '1 560',
    progress: 0,
    accent: 'lavender',
    image: image('photo-1506126613408-eca07ce68773'),
    description: 'Écouter ce qui se passe en toi, mieux le comprendre et retrouver ton équilibre.',
    teacher: 'Dr. Salima Kaci',
    role: 'Psychologue clinicienne',
    lessonsList: ['Une émotion n’est pas un problème', 'Nommer pour apaiser', 'Respirer dans la tempête', 'Se parler avec douceur', 'Les relations qui nourrissent', 'Ton rituel d’équilibre'],
  },
];

const categories = [
  { label: 'Tout découvrir', icon: Compass, count: '24 parcours' },
  { label: 'Épanouissement', icon: Sparkles, count: '8 parcours' },
  { label: 'Organisation', icon: Target, count: '5 parcours' },
  { label: 'Avenir & projets', icon: Zap, count: '6 parcours' },
  { label: 'Bien-être', icon: HeartHandshake, count: '5 parcours' },
];

const defaultUser = { name: 'Yasmine', email: 'yasmine@example.com', streak: 4, completed: 6, minutes: 184 };

function readStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

function App() {
  const [view, setView] = useState('home');
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(() => readStorage('kafil-user', null));
  const [saved, setSaved] = useState(() => readStorage('kafil-saved', ['confidence']));
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tout découvrir');
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => localStorage.setItem('kafil-user', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('kafil-saved', JSON.stringify(saved)), [saved]);

  const openCourse = (course) => { setSelectedCourse(course); setView('course'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const startLearning = (course) => { setSelectedCourse(course); setView('lesson'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const toggleSaved = (id) => setSaved((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  const login = (name = 'Yasmine') => { setUser((current) => ({ ...defaultUser, ...current, name })); setAuth(null); setView('dashboard'); };

  return (
    <div className="app-shell">
      <Header view={view} setView={setView} user={user} setAuth={setAuth} mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />
      {view === 'home' && <Home setView={setView} setAuth={setAuth} openCourse={openCourse} />}
      {view === 'dashboard' && <Dashboard user={user} courses={courses} saved={saved} setView={setView} openCourse={openCourse} startLearning={startLearning} />}
      {view === 'catalog' && <Catalog search={search} setSearch={setSearch} activeCategory={activeCategory} setActiveCategory={setActiveCategory} saved={saved} toggleSaved={toggleSaved} openCourse={openCourse} />}
      {view === 'course' && selectedCourse && <CourseDetail course={selectedCourse} saved={saved} toggleSaved={toggleSaved} setView={setView} startLearning={startLearning} />}
      {view === 'lesson' && selectedCourse && <LessonView course={selectedCourse} setView={setView} setUser={setUser} />}
      {view === 'profile' && <Profile user={user} saved={saved} setView={setView} />}
      {view === 'home' && <Footer setView={setView} />}
      {auth && <AuthModal mode={auth} setAuth={setAuth} login={login} />}
    </div>
  );
}

function Header({ view, setView, user, setAuth, mobileMenu, setMobileMenu }) {
  const links = [['home', 'Accueil'], ['catalog', 'Explorer'], ['dashboard', 'Mon parcours']];
  return <header className={`site-header ${view !== 'home' ? 'header-app' : ''}`}>
    <div className="header-inner">
      <button className="brand" onClick={() => setView('home')} aria-label="Retour à l'accueil"><span className="brand-mark"><span>k</span></span><span className="brand-name">kafil<span>academy</span></span></button>
      <nav className={`main-nav ${mobileMenu ? 'is-open' : ''}`}>
        {links.map(([id, label]) => <button key={id} className={view === id ? 'active' : ''} onClick={() => { if (id === 'dashboard' && !user) setAuth('login'); else setView(id); setMobileMenu(false); }}>{label}</button>)}
        <button onClick={() => { setView('catalog'); setMobileMenu(false); }}>À propos</button>
      </nav>
      <div className="header-actions">
        {user ? <><button className="icon-button notification" aria-label="Notifications"><Bell size={18} /><i /></button><button className="profile-chip" onClick={() => setView('profile')}><span className="avatar">Y</span><span className="profile-name">{user.name}</span><ChevronDown size={15} /></button></> : <><button className="text-button" onClick={() => setAuth('login')}>Se connecter</button><button className="button button-small" onClick={() => setAuth('signup')}>Commencer</button></>}
      </div>
      <button className="mobile-menu-toggle" aria-label="Ouvrir le menu" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X /> : <Menu />}</button>
    </div>
  </header>;
}

function Home({ setView, setAuth, openCourse }) {
  return <main>
    <section className="hero section-wrap">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-dot" /> La plateforme qui croit en toi</div>
        <h1>Grandir ensemble,<br /><em>aller plus loin.</em></h1>
        <p className="hero-intro">Des parcours pensés pour t'aider à prendre confiance, développer tes talents et construire l'avenir dont tu rêves.</p>
        <div className="hero-buttons"><button className="button" onClick={() => setAuth('signup')}>Commencer gratuitement <ArrowUpRight size={17} /></button><button className="quiet-button" onClick={() => setView('catalog')}><span className="play-icon"><Play size={13} fill="currentColor" /></span> Découvrir les parcours</button></div>
        <div className="hero-proof"><div className="avatar-stack"><span>Y</span><span>A</span><span>M</span><span>+</span></div><div><strong>Rejoins 2 500+ apprenants</strong><small>qui avancent chaque jour</small></div></div>
      </div>
      <div className="hero-art">
        <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
        <div className="hero-image-wrap"><img src={image('photo-1529390079861-591de354faf5')} alt="Deux étudiantes qui apprennent ensemble" /><div className="image-sticker sticker-heart"><HeartHandshake size={19} fill="currentColor" /></div><div className="image-sticker sticker-spark"><Sparkles size={19} /></div></div>
        <div className="floating-card progress-float"><div className="mini-icon green-icon"><CheckCircle2 size={17} /></div><div><strong>Ton progrès</strong><span>+24% cette semaine</span></div><div className="mini-bars"><i /><i /><i /><i /><i /></div></div>
        <div className="floating-card quote-float"><span className="quote-mark">“</span><p>Chaque petit pas<br />compte vraiment.</p><span className="quote-author">— L'équipe Kafil</span></div>
      </div>
    </section>
    <section className="impact-strip"><div className="section-wrap impact-inner"><div className="impact-intro"><span className="impact-icon"><HeartHandshake size={21} /></span><div><strong>Apprendre pour mieux avancer</strong><span>Une initiative Kafil El Yatim</span></div></div><div className="impact-stat"><strong>2 500<span>+</span></strong><span>apprenants accompagnés</span></div><div className="impact-stat"><strong>24</strong><span>parcours disponibles</span></div><div className="impact-stat"><strong>96<span>%</span></strong><span>recommandent Kafil Academy</span></div><ArrowRight className="impact-arrow" size={21} /></div></section>
    <section className="section-wrap featured-section"><div className="section-heading"><div><span className="section-kicker">Pour commencer doucement</span><h2>Les parcours du moment</h2></div><button className="link-button" onClick={() => setView('catalog')}>Voir tous les parcours <ArrowRight size={17} /></button></div><div className="course-grid home-courses">{courses.slice(0, 3).map((course) => <CourseCard key={course.id} course={course} openCourse={openCourse} />)}</div></section>
    <section className="section-wrap philosophy"><div className="philosophy-image"><img src={image('photo-1531482615713-2afd69097998')} alt="Groupe qui collabore" /><div className="image-caption"><Users size={18} /><span>On avance mieux<br /><strong>ensemble</strong></span></div></div><div className="philosophy-copy"><span className="section-kicker">Notre manière de faire</span><h2>Un espace pour apprendre, sans pression.</h2><p>Chez Kafil Academy, on ne cherche pas la perfection. On crée un espace bienveillant où chaque question compte, où chaque victoire est célébrée et où chacun peut avancer à son rythme.</p><div className="value-list"><div><span className="value-number">01</span><div><strong>À ton rythme</strong><small>Des leçons courtes, à retrouver quand tu veux.</small></div></div><div><span className="value-number">02</span><div><strong>Avec d'autres</strong><small>Une communauté qui te ressemble et t'encourage.</small></div></div><div><span className="value-number">03</span><div><strong>Pour du concret</strong><small>Des outils qui changent vraiment ton quotidien.</small></div></div></div></div></section>
    <section className="cta-section section-wrap"><div className="cta-inner"><div><span className="section-kicker light-kicker">Le prochain chapitre commence ici</span><h2>Et si tu faisais<br /><em>le premier pas ?</em></h2></div><button className="button button-light" onClick={() => setAuth('signup')}>Créer mon compte <ArrowUpRight size={17} /></button><Sparkles className="cta-spark" size={54} /></div></section>
  </main>;
}

function CourseCard({ course, openCourse, saved = [], toggleSaved }) {
  return <article className="course-card" onClick={() => openCourse(course)}><div className="card-image"><img src={course.image} alt="" /><span className={`category-pill ${course.accent}`}>{course.category}</span>{toggleSaved && <button className={`save-button ${saved.includes(course.id) ? 'saved' : ''}`} aria-label="Enregistrer le parcours" onClick={(event) => { event.stopPropagation(); toggleSaved(course.id); }}><Bookmark size={16} fill={saved.includes(course.id) ? 'currentColor' : 'none'} /></button>}</div><div className="card-content"><div className="card-meta"><span>{course.level}</span><span className="meta-dot">·</span><span><Clock3 size={13} /> {course.duration}</span></div><h3>{course.title}</h3><p>{course.description}</p><div className="card-bottom"><div className="rating"><Star size={14} fill="currentColor" /><strong>{course.rating}</strong><span>({course.students})</span></div><span className="card-arrow"><ArrowUpRight size={17} /></span></div></div></article>;
}

function Dashboard({ user, courses, saved, setView, openCourse, startLearning }) {
  const current = courses.find((course) => course.progress > 0) || courses[0];
  return <main className="app-main section-wrap"><div className="dashboard-top"><div><span className="section-kicker">Lundi 9 novembre 2026</span><h1>Bonjour, {user.name} <span className="wave">✦</span></h1><p>Prête à faire un petit pas pour toi aujourd'hui ?</p></div><div className="streak-card"><span className="streak-flame"><Flame size={22} fill="currentColor" /></span><div><strong>{user.streak} jours</strong><small>de série active</small></div><ArrowUpRight size={16} /></div></div><div className="dashboard-grid"><section className="continue-panel"><div className="panel-heading"><div><span className="section-kicker">Reprendre là où tu en étais</span><h2>Ton parcours en cours</h2></div><button className="dots-button">•••</button></div><div className="continue-card"><div className="continue-image"><img src={current.image} alt="" /><button className="large-play" onClick={() => startLearning(current)}><Play size={19} fill="currentColor" /></button></div><div className="continue-info"><div className="card-meta"><span>{current.category}</span><span className="meta-dot">·</span><span>Étape 4 sur {current.lessons}</span></div><h3>{current.title}</h3><p>Le pouvoir des petits pas</p><div className="progress-label"><span>68% complété</span><span>4 / {current.lessons} leçons</span></div><div className="progress-track"><span style={{ width: `${current.progress}%` }} /></div><button className="button button-small" onClick={() => startLearning(current)}>Continuer la leçon <ArrowRight size={16} /></button></div></div></section><aside className="stats-panel"><div className="panel-heading"><div><span className="section-kicker">Cette semaine</span><h2>Mon énergie</h2></div><button className="dots-button">•••</button></div><div className="energy-number"><strong>184</strong><span>minutes apprises</span><div className="energy-trend"><ArrowUpRight size={14} /> 18%</div></div><div className="week-chart"><div className="chart-lines"><i /><i /><i /></div>{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => <div className="chart-day" key={`${day}-${index}`}><div className={`chart-bar bar-${index}`}><span /></div><small>{day}</small></div>)}</div><div className="goal-row"><span className="goal-badge"><Target size={15} /></span><div><strong>Objectif hebdomadaire</strong><small>3 h sur 4 h</small></div><div className="goal-ring">75%</div></div></aside></div><section className="dashboard-section"><div className="section-heading"><div><span className="section-kicker">Pour toi</span><h2>Continuer à explorer</h2></div><button className="link-button" onClick={() => setView('catalog')}>Voir tout <ArrowRight size={17} /></button></div><div className="course-grid">{courses.slice(1, 4).map((course) => <CourseCard key={course.id} course={course} openCourse={openCourse} saved={saved} />)}</div></section><section className="quote-banner"><div className="quote-bubble"><Sparkles size={20} /></div><div><strong>“Le meilleur investissement que tu puisses faire, c’est en toi-même.”</strong><span>— Une pensée pour aujourd'hui</span></div><button onClick={() => setView('catalog')}><ArrowUpRight size={18} /></button></section></main>;
}

function Catalog({ search, setSearch, activeCategory, setActiveCategory, saved, toggleSaved, openCourse }) {
  const filtered = useMemo(() => courses.filter((course) => (activeCategory === 'Tout découvrir' || course.category === activeCategory || (activeCategory === 'Avenir & projets' && course.category === 'Projets & avenir')) && `${course.title} ${course.description}`.toLowerCase().includes(search.toLowerCase())), [activeCategory, search]);
  return <main className="app-main section-wrap catalog-main"><div className="catalog-heading"><div><span className="section-kicker">Prends le temps de choisir</span><h1>Trouve le parcours<br /><em>qui te ressemble.</em></h1></div><p>Des apprentissages utiles pour les moments qui comptent. Commence par ce qui t'appelle aujourd'hui.</p></div><div className="catalog-toolbar"><div className="search-box"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un parcours..." /></div><div className="filter-tabs">{categories.map(({ label, icon: Icon }) => <button className={activeCategory === label ? 'active' : ''} key={label} onClick={() => setActiveCategory(label)}><Icon size={15} />{label}</button>)}</div></div><div className="catalog-result-row"><span><strong>{filtered.length}</strong> parcours pour toi</span><button className="sort-button">Les plus populaires <ChevronDown size={15} /></button></div><div className="course-grid catalog-grid">{filtered.map((course) => <CourseCard key={course.id} course={course} openCourse={openCourse} saved={saved} toggleSaved={toggleSaved} />)}</div>{filtered.length === 0 && <div className="empty-state"><Search size={30} /><h3>Aucun parcours trouvé</h3><p>Essaie un autre mot ou une autre catégorie.</p></div>}</main>;
}

function CourseDetail({ course, saved, toggleSaved, setView, startLearning }) {
  const completedLessons = Math.floor((course.progress / 100) * course.lessons);
  return <main className="course-detail"><div className="section-wrap breadcrumb"><button onClick={() => setView('catalog')}><ArrowLeft size={16} /> Explorer les parcours</button><span>/</span><span>{course.title}</span></div><section className="section-wrap detail-hero"><div className="detail-copy"><span className={`category-pill ${course.accent}`}>{course.category}</span><h1>{course.title}</h1><p>{course.description}</p><div className="teacher-line"><span className="teacher-avatar">{course.teacher.split(' ').map((name) => name[0]).join('').slice(0, 2)}</span><div><strong>Avec {course.teacher}</strong><small>{course.role}</small></div></div><div className="detail-stats"><span><Clock3 size={16} /> {course.duration}</span><span><BookOpen size={16} /> {course.lessons} leçons</span><span><Star size={16} fill="currentColor" /> {course.rating} <small>({course.students})</small></span></div><div className="detail-actions"><button className="button" onClick={() => startLearning(course)}><Play size={16} fill="currentColor" /> {course.progress ? 'Continuer le parcours' : 'Commencer le parcours'}</button><button className={`save-detail ${saved.includes(course.id) ? 'saved' : ''}`} onClick={() => toggleSaved(course.id)}><Bookmark size={17} fill={saved.includes(course.id) ? 'currentColor' : 'none'} /> {saved.includes(course.id) ? 'Enregistré' : 'Enregistrer'}</button></div></div><div className="detail-visual"><img src={course.image} alt="" /><div className="visual-overlay"><span>{course.lessons} étapes pour avancer</span><div className="detail-progress"><i style={{ width: `${course.progress}%` }} /></div><small>{course.progress}% complété</small></div></div></section><section className="section-wrap syllabus"><div className="syllabus-intro"><span className="section-kicker">Ce que tu vas découvrir</span><h2>Un parcours en {course.lessons} étapes</h2><p>Chaque leçon a été pensée pour être suivie en quelques minutes, avec une idée à retenir et une action simple à essayer.</p></div><div className="lesson-list">{course.lessonsList.map((lesson, index) => <div className={`lesson-row ${index < completedLessons ? 'done' : ''}`} key={lesson}><span className="lesson-number">{index < completedLessons ? <Check size={15} /> : String(index + 1).padStart(2, '0')}</span><div><strong>{lesson}</strong><small>{index === 0 ? 'Introduction · 8 min' : `Leçon ${index + 1} · ${index % 2 ? '12' : '9'} min`}</small></div><span className="lesson-status">{index < completedLessons ? 'Terminé' : index === completedLessons ? 'À suivre' : <LockKeyhole size={15} />}</span></div>)}</div></section></main>;
}

function LessonView({ course, setView, setUser }) {
  const [lessonIndex, setLessonIndex] = useState(Math.min(Math.floor((course.progress / 100) * course.lessons), course.lessonsList.length - 1));
  const [checked, setChecked] = useState(false);
  const lesson = course.lessonsList[lessonIndex];
  const next = () => { setChecked(true); setUser((current) => ({ ...current, minutes: current.minutes + 9 })); if (lessonIndex < course.lessonsList.length - 1) setTimeout(() => { setLessonIndex((index) => index + 1); setChecked(false); }, 450); };
  return <main className="lesson-view"><div className="lesson-topbar"><button onClick={() => setView('course')}><ArrowLeft size={17} /> Quitter la leçon</button><div className="lesson-progress-top"><span>Leçon {lessonIndex + 1} sur {course.lessons}</span><div><i style={{ width: `${((lessonIndex + 1) / course.lessons) * 100}%` }} /></div></div><button className="icon-button"><Bookmark size={17} /></button></div><div className="lesson-body"><aside className="lesson-sidebar"><span className="section-kicker">{course.category}</span><h2>{course.title}</h2><div className="lesson-sidebar-list">{course.lessonsList.map((item, index) => <button className={lessonIndex === index ? 'active' : index < lessonIndex ? 'completed' : ''} key={item} onClick={() => setLessonIndex(index)}><span>{index < lessonIndex ? <Check size={13} /> : index + 1}</span>{item}</button>)}</div><div className="need-help"><HeartHandshake size={18} /><strong>Besoin d'un coup de pouce ?</strong><span>Tu peux revenir ici quand tu veux.</span></div></aside><article className="lesson-content"><div className="lesson-label"><span className="play-dot"><Play size={12} fill="currentColor" /></span> À regarder · 09 min</div><h1>{lesson}</h1><p className="lesson-lead">Les grands changements commencent rarement par de grands gestes. Ils commencent par une décision minuscule : celle de faire un premier pas, aujourd'hui.</p><div className="video-placeholder"><img src={course.image} alt="" /><div className="video-shade" /><button className="video-play"><Play size={26} fill="currentColor" /></button><span className="video-duration">09:12</span></div><div className="lesson-note"><Sparkles size={18} /><div><strong>À retenir</strong><p>Tu n'as pas besoin d'avoir tout compris pour commencer. Choisis une action assez petite pour être impossible à repousser.</p></div></div><div className="lesson-footer"><button className={`button ${checked ? 'success-button' : ''}`} onClick={next}>{checked ? <><Check size={16} /> Bravo, c'est fait !</> : <>Marquer comme terminé <ArrowRight size={16} /></>}</button><span><Clock3 size={14} /> Ton progrès est sauvegardé automatiquement</span></div></article></div></main>;
}

function Profile({ user, saved, setView }) {
  return <main className="app-main section-wrap profile-page"><div className="profile-header"><div className="profile-avatar-large">Y</div><div><span className="section-kicker">Mon espace</span><h1>{user.name} Benali</h1><p>Membre depuis novembre 2026 · Alger, Algérie</p></div><button className="button button-outline"><Settings size={16} /> Modifier mon profil</button></div><div className="profile-cards"><div className="profile-card"><Trophy size={21} /><strong>{user.completed}</strong><span>leçons terminées</span></div><div className="profile-card"><Flame size={21} /><strong>{user.streak} jours</strong><span>meilleure série</span></div><div className="profile-card"><Bookmark size={21} /><strong>{saved.length}</strong><span>parcours enregistrés</span></div></div><div className="profile-grid"><section className="profile-section"><div className="section-heading"><div><span className="section-kicker">Tes réussites</span><h2>Badges & étapes</h2></div></div><div className="badges"><div className="badge-item active"><span><Flame size={22} /></span><strong>Premier élan</strong><small>3 jours de suite</small></div><div className="badge-item active"><span><BookOpen size={22} /></span><strong>Curieux·se</strong><small>5 leçons suivies</small></div><div className="badge-item"><span><Crown size={22} /></span><strong>Régulier·e</strong><small>7 jours de suite</small></div></div></section><section className="profile-section saved-section"><div className="section-heading"><div><span className="section-kicker">Pour plus tard</span><h2>Mes parcours enregistrés</h2></div><button className="link-button" onClick={() => setView('catalog')}>Explorer <ArrowRight size={17} /></button></div><p>{saved.length} parcours à découvrir quand tu seras prête.</p></section></div></main>;
}

function AuthModal({ mode, setAuth, login }) {
  const isSignup = mode === 'signup';
  const [name, setName] = useState('Yasmine');
  return <div className="modal-backdrop" onMouseDown={() => setAuth(null)}><div className="auth-modal" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setAuth(null)}><X size={18} /></button><div className="auth-brand"><span className="brand-mark"><span>k</span></span><span className="brand-name">kafil<span>academy</span></span></div><span className="section-kicker">{isSignup ? 'Bienvenue dans ton espace' : 'Content de te revoir'}</span><h2>{isSignup ? 'Commence par toi.' : 'On reprend ensemble ?'}</h2><p>{isSignup ? 'Crée ton compte en quelques secondes et commence à avancer à ton rythme.' : 'Connecte-toi pour retrouver tes parcours et tes progrès.'}</p>{isSignup && <label>Ton prénom<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex. Yasmine" /></label>}<label>Adresse e-mail<input type="email" placeholder="toi@exemple.com" /></label><label>Mot de passe<input type="password" placeholder="••••••••" /></label><button className="button auth-submit" onClick={() => login(name || 'Yasmine')}>{isSignup ? 'Créer mon compte' : 'Se connecter'} <ArrowRight size={17} /></button><div className="auth-divider"><span>ou continuer avec</span></div><button className="social-button" onClick={() => login(name || 'Yasmine')}><span className="google-dot">G</span> Google</button><small className="auth-switch">{isSignup ? 'Tu as déjà un compte ?' : 'Pas encore de compte ?'} <button onClick={() => setAuth(isSignup ? 'login' : 'signup')}>{isSignup ? 'Se connecter' : 'Créer mon compte'}</button></small></div></div>;
}

function Footer({ setView }) {
  return <footer className="site-footer"><div className="section-wrap footer-top"><div><button className="brand footer-brand" onClick={() => setView('home')}><span className="brand-mark"><span>k</span></span><span className="brand-name">kafil<span>academy</span></span></button><p>Apprendre, grandir et faire<br />la différence.</p></div><div className="footer-links"><div><strong>Découvrir</strong><button onClick={() => setView('catalog')}>Les parcours</button><button>Notre approche</button><button>La communauté</button></div><div><strong>Kafil El Yatim</strong><button>À propos de nous</button><button>Nos projets</button><button>Nous contacter</button></div><div><strong>On reste en lien</strong><button>Instagram</button><button>Facebook</button><button>LinkedIn</button></div></div></div><div className="section-wrap footer-bottom"><span>© 2026 Kafil Academy · Une initiative Kafil El Yatim</span><span>Fait avec <HeartHandshake size={14} fill="currentColor" /> en Algérie</span></div></footer>;
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
