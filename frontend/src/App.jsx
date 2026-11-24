import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, AtSign,
  BarChart3, BriefcaseBusiness, Check, ChevronDown, Code2, ExternalLink,
  Github, ImagePlus, Instagram, LayoutDashboard, LoaderCircle, LockKeyhole,
  LogOut, Mail, Menu, MessageCircle, MonitorSmartphone, Pencil, Plus,
  Send, Settings2, ShieldCheck, Trash2, Video, X
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { api, assetUrl, getErrorMessage } from './api.js';

const TOKEN_KEY = 'bineta_admin_token';

const skillGroups = [
  { title: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'] },
  { title: 'Backend', items: ['Node.js', 'Express.js', 'REST APIs'] },
  { title: 'Data', items: ['MySQL', 'Database design'] },
  { title: 'Beyond code', items: ['App development', 'Video editing', 'UI/UX design'] }
];

const services = [
  { icon: Code2, number: '01', title: 'Website development', text: 'Fast, responsive websites shaped around real people and the work your business does.' },
  { icon: MonitorSmartphone, number: '02', title: 'Full-stack development', text: 'From a considered interface to a practical API and database, built to work together.' },
  { icon: BriefcaseBusiness, number: '03', title: 'Application development', text: 'Useful digital tools and application experiences designed to make everyday work simpler.' },
  { icon: Video, number: '04', title: 'Video editing', text: 'Clear, well-paced edits for product stories, social content, and creative ideas.' },
  { icon: Settings2, number: '05', title: 'Responsive design', text: 'Thoughtful layouts that feel natural on a phone, tablet, and desktop.' },
  { icon: ShieldCheck, number: '06', title: 'Website maintenance', text: 'Ongoing updates and careful improvements to keep your site reliable and current.' }
];

function Brand({ light = false }) {
  return <Link className={`brand${light ? ' brand-light' : ''}`} to="/" aria-label="Bineta Code home">bineta<span>.</span>code</Link>;
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [['Work', '#work'], ['About', '#about'], ['Services', '#services'], ['Contact', '#contact']];
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <button className="icon-button mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={`site-nav${menuOpen ? ' nav-open' : ''}`} aria-label="Main navigation">
          {links.map(([label, target]) => <a href={target} key={label} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a className="nav-cta" href="#contact" onClick={() => setMenuOpen(false)}>Let’s talk <ArrowUpRight size={15} /></a>
        </nav>
      </div>
    </header>
  );
}

function SectionKicker({ children, number }) {
  return <div className="section-kicker"><span>{number}</span><i />{children}</div>;
}

function Avatar({ profile, large = false }) {
  const initials = profile?.full_name
    ? profile.full_name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    : 'BC';
  return (
    <div className={`avatar${large ? ' avatar-large' : ''}`}>
      {profile?.profile_image
        ? <img src={assetUrl(profile.profile_image)} alt={profile.full_name || 'Profile'} />
        : <span aria-label={profile?.full_name || 'BINETA CODE'}>{initials}</span>}
      <div className="avatar-note"><i /> Portfolio / Ethiopia</div>
    </div>
  );
}

function PublicPortfolio() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [profileState, setProfileState] = useState('loading');
  const [projectState, setProjectState] = useState('loading');
  const [contact, setContact] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactState, setContactState] = useState({ loading: false, note: '', error: false });

  useEffect(() => {
    api.get('/profile').then(({ data }) => {
      if (!data) {
        setProfileState('missing');
        return;
      }
      setProfile(data);
      setProfileState('ready');
    })
      .catch(() => setProfileState('error'));
    api.get('/projects').then(({ data }) => { setProjects(data); setProjectState('ready'); })
      .catch(() => setProjectState('error'));
  }, []);

  async function sendMessage(event) {
    event.preventDefault();
    setContactState({ loading: true, note: '', error: false });
    try {
      const { data } = await api.post('/contact', contact);
      setContact({ name: '', email: '', subject: '', message: '' });
      setContactState({ loading: false, note: data.message, error: false });
    } catch (error) {
      setContactState({ loading: false, note: getErrorMessage(error), error: true });
    }
  }

  const socials = Object.entries(profile?.social_links || {}).filter(([, url]) => Boolean(url));

  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero page-wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> {profile?.headline || (profileState === 'loading' ? 'Loading profile…' : 'Profile unavailable')}</div>
            <h1>Digital craft,<br />built with <em>purpose.</em></h1>
            <p className="hero-intro">{profile ? `I’m ${profile.full_name} — a developer and creative building thoughtful websites, useful applications, and digital experiences that feel human.` : profileState === 'loading' ? 'Loading profile information…' : 'Profile information is currently unavailable.'}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">Explore my work <ArrowDownRight size={17} /></a>
              <a className="text-link" href="#contact">Start a conversation <ArrowRight size={16} /></a>
            </div>
            <div className="hero-proof"><span className="proof-line" /><span>Curiosity in the details. Care in the build.</span></div>
          </div>
          <div className="hero-art" aria-label="Profile portrait">
            <div className="art-grid" />
            <div className="art-index">BC—001</div>
            <Avatar profile={profile} large />
            <div className="art-caption"><span>BA / 01</span><span>Developer & creative</span></div>
          </div>
          <a className="scroll-cue" href="#work"><span>Scroll to explore</span><ArrowDown size={15} /></a>
        </section>
        {(profileState === 'error' || profileState === 'missing') && <div className="page-wrap profile-fetch-alert notice notice-error" role="alert">{profileState === 'missing' ? 'No profile is configured yet. Add profile information from the admin dashboard.' : 'Profile data could not be loaded. Check the API and database connection.'}</div>}

        <section className="work-section section-pad" id="work">
          <div className="page-wrap">
            <div className="section-top">
              <div><SectionKicker number="01">Selected work</SectionKicker><h2>Ideas made <em>real.</em></h2></div>
              <p className="section-aside">A selection of projects, experiments, and things made with intention.</p>
            </div>
            {projectState === 'loading' && <div className="inline-state"><LoaderCircle className="spin" size={18} /> Loading projects…</div>}
            {projectState === 'error' && <div className="notice notice-error">Projects are unavailable right now. Please try again later.</div>}
            {projectState === 'ready' && projects.length === 0 && (
              <div className="empty-work"><span className="empty-mark">B<span>.</span></span><div><h3>The next story is being written.</h3><p>New projects will appear here as they’re ready to share.</p></div><a href="#contact">Have a project in mind? <ArrowUpRight size={15} /></a></div>
            )}
            {projects.length > 0 && (
              <div className="project-grid">
                {projects.map((project, index) => (
                  <article className={`project-card${index === 0 ? ' project-featured' : ''}`} key={project.id}>
                    <div className="project-image">
                      {project.image ? <img src={assetUrl(project.image)} alt={`${project.title} project`} loading="lazy" /> : <div className="project-placeholder"><Code2 size={32} /><span>BINETA CODE / PROJECT {String(index + 1).padStart(2, '0')}</span></div>}
                      <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="project-meta"><div><h3>{project.title}</h3><p>{project.description}</p></div><ArrowUpRight size={19} /></div>
                    <div className="project-footer">
                      <div className="tag-list">{(project.technologies || []).map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
                      <div className="project-links">
                        {project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer">Live <ExternalLink size={14} /></a>}
                        {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer">Source <Github size={14} /></a>}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="about-section section-pad" id="about">
          <div className="page-wrap about-grid">
            <div className="about-label"><SectionKicker number="02">A little about me</SectionKicker><span className="about-coordinate">07° 11′ N<br />035° 35′ E</span></div>
            <div className="about-content">
              <h2>Good work starts with <em>good questions.</em></h2>
              <p className="about-lead">{profile?.biography || (profileState === 'loading' ? 'Loading profile details…' : 'Profile details are currently unavailable.')}</p>
              <div className="about-facts">
                <div><span className="fact-index">01</span><div><strong>My approach</strong><p>Stay curious, listen closely, and make the useful thing beautifully clear.</p></div></div>
                <div><span className="fact-index">02</span><div><strong>My focus</strong><p>Building a strong foundation in software engineering, one considered project at a time.</p></div></div>
              </div>
              <a className="text-link" href="#contact">A bit more about working together <ArrowRight size={16} /></a>
            </div>
          </div>
        </section>

        <section className="skills-section section-pad">
          <div className="page-wrap">
            <div className="section-top"><div><SectionKicker number="03">The toolkit</SectionKicker><h2>Range with a <em>reason.</em></h2></div><p className="section-aside">Tools are only useful when they help solve the right problem.</p></div>
            <div className="skill-groups">{skillGroups.map((group, index) => <div className="skill-group" key={group.title}><span className="skill-index">0{index + 1}</span><h3>{group.title}</h3><div>{group.items.map((skill) => <span className="skill-pill" key={skill}>{skill}</span>)}</div></div>)}</div>
          </div>
        </section>

        <section className="services-section section-pad" id="services">
          <div className="page-wrap">
            <div className="section-top"><div><SectionKicker number="04">Ways I can help</SectionKicker><h2>Thoughtful work.<br /><em>Solid foundations.</em></h2></div><p className="section-aside">From the first sketch to the final details, every part of the experience deserves care.</p></div>
            <div className="service-list">{services.map(({ icon: Icon, number, title, text }) => <article className="service-row" key={number}><span className="service-number">{number}</span><Icon className="service-icon" size={20} strokeWidth={1.6} /><h3>{title}</h3><p>{text}</p><ArrowUpRight className="service-arrow" size={17} /></article>)}</div>
          </div>
        </section>

        <section className="contact-section section-pad" id="contact">
          <div className="page-wrap contact-grid">
            <div className="contact-copy">
              <SectionKicker number="05">Have something in mind?</SectionKicker>
              <h2>Let’s make<br />something <em>matter.</em></h2>
              <p>Tell me a little about what you’re working on. I’ll get back to you as soon as I can.</p>
              {profile?.email && <a className="contact-email" href={`mailto:${profile.email}`}><AtSign size={17} />{profile.email}<ArrowUpRight size={15} /></a>}
              {!!socials.length && <div className="social-links">{socials.map(([name, url]) => <a href={url} key={name} target="_blank" rel="noreferrer">{name}<ArrowUpRight size={13} /></a>)}</div>}
            </div>
            <form className="contact-form" onSubmit={sendMessage}>
              <div className="form-pair">
                <label>Your name<input name="name" autoComplete="name" maxLength="100" required value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} placeholder="How should I address you?" /></label>
                <label>Email address<input name="email" type="email" autoComplete="email" maxLength="254" required value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} placeholder="you@example.com" /></label>
              </div>
              <label>What’s it about?<input name="subject" maxLength="180" required value={contact.subject} onChange={(event) => setContact({ ...contact, subject: event.target.value })} placeholder="A project, an idea, a question…" /></label>
              <label>A few more details<textarea name="message" rows="5" minLength="10" maxLength="5000" required value={contact.message} onChange={(event) => setContact({ ...contact, message: event.target.value })} placeholder="Tell me a little about it." /></label>
              {contactState.note && <div className={`notice ${contactState.error ? 'notice-error' : 'notice-success'}`} role="status">{contactState.note}</div>}
              <button className="button button-primary form-submit" type="submit" disabled={contactState.loading}>{contactState.loading ? 'Sending…' : 'Send your message'}{contactState.loading ? <LoaderCircle className="spin" size={17} /> : <Send size={16} />}</button>
            </form>
          </div>
        </section>
      </main>
      <footer className="site-footer"><div className="page-wrap footer-inner"><Brand light /><span>Made with intention · Ethiopia</span><a href="#home">Back to top <ArrowUpRight size={14} /></a><span>© {new Date().getFullYear()} BINETA CODE</span></div></footer>
    </>
  );
}

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function signIn(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem(TOKEN_KEY, data.token);
      navigate('/admin', { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return <div className="login-page"><Link to="/" className="login-back"><ArrowLeft size={16} /> Back to portfolio</Link><div className="login-card"><Brand /><div className="login-lock"><LockKeyhole size={21} /></div><p className="login-kicker">PRIVATE WORKSPACE</p><h1>Welcome back.</h1><p className="login-desc">Sign in to manage your portfolio.</p>{location.state?.message && <div className="notice notice-success">{location.state.message}</div>}<form onSubmit={signIn}><label>Username or email<input autoComplete="username" required value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} /></label><label>Password<input type="password" autoComplete="current-password" required value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} /></label>{error && <div className="notice notice-error" role="alert">{error}</div>}<button className="button button-primary form-submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}<ArrowRight size={16} /></button></form></div><span className="login-foot">BINETA CODE · ADMIN</span></div>;
}

function AdminPanel() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Overview');
  const [overview, setOverview] = useState(null);
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [activeMessage, setActiveMessage] = useState(null);
  const [editing, setEditing] = useState(null);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', technologies: '', live_url: '', github_url: '', image: null });
  const [projectBusy, setProjectBusy] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '' });
  const [passwordNotice, setPasswordNotice] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  async function refresh() {
    setLoading(true);
    setError('');
    try {
      const [overviewResponse, messagesResponse, projectsResponse, profileResponse] = await Promise.all([
        api.get('/admin/overview'), api.get('/admin/messages'), api.get('/projects'), api.get('/profile')
      ]);
      setOverview(overviewResponse.data);
      setMessages(messagesResponse.data);
      setProjects(projectsResponse.data);
      setProfile(profileResponse.data);
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        navigate('/admin/login', { replace: true });
        return;
      }
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    navigate('/admin/login', { replace: true });
  }

  async function changeMessageStatus(message) {
    try {
      const status = message.status === 'read' ? 'unread' : 'read';
      await api.patch(`/admin/messages/${message.id}`, { status });
      setActiveMessage({ ...message, status });
      await refresh();
    } catch (requestError) { setError(getErrorMessage(requestError)); }
  }

  async function removeMessage(message) {
    if (!window.confirm(`Delete the message from ${message.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/messages/${message.id}`);
      setActiveMessage(null);
      setNotice('Message deleted.');
      await refresh();
    } catch (requestError) { setError(getErrorMessage(requestError)); }
  }

  function startEdit(project) {
    setEditing(project);
    setProjectForm({
      title: project.title, description: project.description,
      technologies: (project.technologies || []).join(', '),
      live_url: project.live_url || '', github_url: project.github_url || '', image: null
    });
  }

  function resetProjectForm() {
    setEditing(null);
    setProjectForm({ title: '', description: '', technologies: '', live_url: '', github_url: '', image: null });
  }

  async function saveProject(event) {
    event.preventDefault();
    setProjectBusy(true);
    setError('');
    const formData = new FormData();
    formData.append('title', projectForm.title);
    formData.append('description', projectForm.description);
    formData.append('technologies', JSON.stringify(projectForm.technologies.split(',').map((value) => value.trim()).filter(Boolean)));
    formData.append('live_url', projectForm.live_url);
    formData.append('github_url', projectForm.github_url);
    if (projectForm.image) formData.append('image', projectForm.image);
    try {
      if (editing) await api.put(`/admin/projects/${editing.id}`, formData);
      else await api.post('/admin/projects', formData);
      setNotice(editing ? 'Project updated.' : 'Project added.');
      resetProjectForm();
      await refresh();
    } catch (requestError) { setError(getErrorMessage(requestError)); }
    finally { setProjectBusy(false); }
  }

  async function removeProject(project) {
    if (!window.confirm(`Delete “${project.title}”? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/projects/${project.id}`);
      setNotice('Project deleted.');
      await refresh();
    } catch (requestError) { setError(getErrorMessage(requestError)); }
  }

  async function saveProfile(event) {
    event.preventDefault();
    setError('');
    const formData = new FormData();
    formData.append('full_name', profile.full_name);
    formData.append('headline', profile.headline);
    formData.append('biography', profile.biography);
    formData.append('email', profile.email);
    formData.append('social_links', JSON.stringify(profile.social_links || {}));
    if (profileImage) formData.append('image', profileImage);
    try {
      await api.put('/admin/profile', formData);
      setProfileImage(null);
      setNotice('Profile saved.');
      await refresh();
    } catch (requestError) { setError(getErrorMessage(requestError)); }
  }

  async function changePassword(event) {
    event.preventDefault();
    setPasswordNotice('');
    try {
      await api.put('/admin/password', passwordForm);
      localStorage.removeItem(TOKEN_KEY);
      navigate('/admin/login', { replace: true, state: { message: 'Password changed. Sign in with your new password.' } });
    } catch (requestError) { setPasswordNotice(getErrorMessage(requestError)); }
  }

  const chartData = useMemo(() => {
    const counts = new Map((overview?.monthlyMessages || []).map((item) => [item.month, Number(item.total)]));
    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - 5 + index, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return { month: date.toLocaleString('en', { month: 'short' }), messages: counts.get(key) || 0 };
    });
  }, [overview]);

  const tabs = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Projects', icon: BriefcaseBusiness },
    { name: 'Messages', icon: MessageCircle, count: overview?.unread },
    { name: 'Settings', icon: Settings2 }
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Brand light />
        <div className="sidebar-caption">WORKSPACE</div>
        <nav>{tabs.map(({ name, icon: Icon, count }) => <button key={name} className={tab === name ? 'sidebar-link active' : 'sidebar-link'} onClick={() => { setTab(name); setNotice(''); }}><Icon size={17} />{name}{count > 0 && <span className="sidebar-count">{count}</span>}</button>)}</nav>
        <div className="sidebar-bottom"><a href="/" className="sidebar-link"><ArrowLeft size={17} />View portfolio</a><button className="sidebar-link" onClick={signOut}><LogOut size={17} />Sign out</button><span className="sidebar-version">BINETA CODE · ADMIN</span></div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar"><div><span className="admin-crumb">Workspace</span><ChevronDown size={14} /><strong>{tab}</strong></div><div className="admin-user"><span className="admin-avatar">BA</span><span>Biniam Agegnehu</span></div></header>
        <div className="admin-content">
          <div className="admin-heading"><div><span className="admin-date">PORTFOLIO MANAGEMENT</span><h1>{tab === 'Overview' ? 'Good things are in progress.' : tab}</h1><p>{tab === 'Overview' ? 'A clear view of your work and conversations.' : tab === 'Projects' ? 'Shape the work visitors see on your site.' : tab === 'Messages' ? 'Conversations from the contact form.' : 'Keep your public profile up to date.'}</p></div><button className="refresh-button" onClick={refresh}><LoaderCircle size={15} className={loading ? 'spin' : ''} />Refresh</button></div>
          {error && <div className="notice notice-error">{error}</div>}
          {notice && <div className="notice notice-success">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notification"><X size={15} /></button></div>}
          {loading && !overview && <div className="inline-state"><LoaderCircle className="spin" size={18} /> Loading dashboard data…</div>}

          {tab === 'Overview' && overview && <section>
            <div className="stat-grid"><div className="stat-card"><span>Published projects</span><strong>{overview.projects}</strong><BriefcaseBusiness size={19} /></div><div className="stat-card"><span>Total messages</span><strong>{overview.messages}</strong><Mail size={19} /></div><div className="stat-card"><span>Needs a reply</span><strong>{overview.unread}</strong><MessageCircle size={19} /></div></div>
            <div className="dashboard-grid"><section className="dashboard-panel chart-panel"><div className="panel-title"><div><h2>Message activity</h2><p>Contact form submissions · last six months</p></div><span className="chart-legend"><i />Messages</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}><defs><linearGradient id="messagesFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#b6d367" stopOpacity={0.22} /><stop offset="100%" stopColor="#b6d367" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#282c27" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8f958a', fontSize: 12 }} dy={10} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#8f958a', fontSize: 12 }} /><Tooltip contentStyle={{ background: '#1b1e1a', border: '1px solid #3a4034', borderRadius: 8 }} itemStyle={{ color: '#d8e6ac' }} labelStyle={{ color: '#9da393' }} /><Area type="monotone" dataKey="messages" stroke="#b6d367" strokeWidth={2} fill="url(#messagesFill)" /></AreaChart></ResponsiveContainer></div></section>
              <section className="dashboard-panel recent-panel"><div className="panel-title"><div><h2>Recent messages</h2><p>Latest notes from your contact form</p></div><button className="subtle-button" onClick={() => setTab('Messages')}>All messages <ArrowRight size={14} /></button></div>{overview.recentMessages.length ? <div className="recent-list">{overview.recentMessages.map((message) => <button key={message.id} className="recent-message" onClick={() => { setActiveMessage(message); setTab('Messages'); }}><span className={`message-status-dot ${message.status}`} /><span className="recent-message-copy"><strong>{message.name}</strong><small>{message.subject}</small></span><span className="recent-message-date">{new Date(message.created_at).toLocaleDateString()}</span></button>)}</div> : <div className="panel-empty"><Mail size={20} /><span>No messages yet.</span></div>}</section>
            </div>
          </section>}

          {tab === 'Projects' && <section className="management-grid"><form className="dashboard-panel project-editor" onSubmit={saveProject}><div className="panel-title"><div><h2>{editing ? 'Edit project' : 'Add a project'}</h2><p>{editing ? 'Update project details and links.' : 'Share a new piece of work.'}</p></div>{editing && <button className="icon-button" type="button" onClick={resetProjectForm} aria-label="Cancel editing"><X size={17} /></button>}</div><label>Project title<input required maxLength="120" value={projectForm.title} onChange={(event) => setProjectForm({ ...projectForm, title: event.target.value })} /></label><label>Description<textarea required minLength="10" maxLength="5000" rows="4" value={projectForm.description} onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })} /></label><label>Technologies <span className="field-note">Separate with commas</span><input value={projectForm.technologies} onChange={(event) => setProjectForm({ ...projectForm, technologies: event.target.value })} placeholder="React, Node.js, MySQL" /></label><label>Project image <span className="field-note">JPEG, PNG, WebP or GIF · max 5 MB</span><span className="file-input"><ImagePlus size={17} /><span>{projectForm.image?.name || 'Choose an image'}</span><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => setProjectForm({ ...projectForm, image: event.target.files?.[0] || null })} /></span></label><div className="form-pair"><label>Live demo URL<input type="url" value={projectForm.live_url} onChange={(event) => setProjectForm({ ...projectForm, live_url: event.target.value })} /></label><label>GitHub URL<input type="url" value={projectForm.github_url} onChange={(event) => setProjectForm({ ...projectForm, github_url: event.target.value })} /></label></div><button className="button button-primary form-submit" disabled={projectBusy}>{projectBusy ? 'Saving…' : editing ? 'Save changes' : 'Add project'}{projectBusy ? <LoaderCircle size={16} className="spin" /> : <Plus size={16} />}</button></form>
            <section className="dashboard-panel project-list-panel"><div className="panel-title"><div><h2>Your projects</h2><p>{projects.length} {projects.length === 1 ? 'project' : 'projects'} published</p></div></div>{projects.length ? <div className="manage-project-list">{projects.map((project) => <article className="manage-project" key={project.id}>{project.image ? <img src={assetUrl(project.image)} alt="" /> : <div className="manage-project-placeholder"><Code2 size={19} /></div>}<div className="manage-project-info"><strong>{project.title}</strong><span>{(project.technologies || []).join(' · ') || 'No technologies listed'}</span></div><button className="icon-button" onClick={() => startEdit(project)} aria-label={`Edit ${project.title}`}><Pencil size={15} /></button><button className="icon-button danger-icon" onClick={() => removeProject(project)} aria-label={`Delete ${project.title}`}><Trash2 size={15} /></button></article>)}</div> : <div className="panel-empty"><BriefcaseBusiness size={20} /><span>No projects yet. Add one to get started.</span></div>}</section></section>}

          {tab === 'Messages' && <section className="message-management">{activeMessage && <article className="dashboard-panel message-detail"><button className="detail-back" onClick={() => setActiveMessage(null)}><ArrowLeft size={15} /> All messages</button><div className="message-detail-head"><div><span className="admin-date">{new Date(activeMessage.created_at).toLocaleString()}</span><h2>{activeMessage.subject}</h2><p>From <strong>{activeMessage.name}</strong> · <a href={`mailto:${activeMessage.email}`}>{activeMessage.email}</a></p></div><button className="icon-button" onClick={() => removeMessage(activeMessage)} aria-label="Delete message"><Trash2 size={17} /></button></div><p className="message-body">{activeMessage.message}</p><button className="button button-secondary" onClick={() => changeMessageStatus(activeMessage)}>{activeMessage.status === 'read' ? 'Mark unread' : 'Mark as read'}<Check size={15} /></button></article>}
            <section className="dashboard-panel messages-table"><div className="panel-title"><div><h2>Inbox</h2><p>{messages.length} {messages.length === 1 ? 'conversation' : 'conversations'}</p></div></div>{messages.length ? messages.map((message) => <button className={`message-row${message.status === 'unread' ? ' unread-row' : ''}`} key={message.id} onClick={() => { setActiveMessage(message); if (message.status === 'unread') changeMessageStatus(message); }}><span className={`message-status-dot ${message.status}`} /><span className="message-row-name">{message.name}</span><span className="message-row-subject">{message.subject}</span><span className="message-row-date">{new Date(message.created_at).toLocaleDateString()}</span><ArrowRight size={15} /></button>) : <div className="panel-empty"><Mail size={20} /><span>No messages received yet.</span></div>}</section>
          </section>}

          {tab === 'Settings' && profile && <section className="settings-grid"><form className="dashboard-panel settings-form" onSubmit={saveProfile}><div className="panel-title"><div><h2>Public profile</h2><p>This information appears on your portfolio.</p></div></div><label>Full name<input required maxLength="120" value={profile.full_name} onChange={(event) => setProfile({ ...profile, full_name: event.target.value })} /></label><label>Professional headline<input required maxLength="180" value={profile.headline} onChange={(event) => setProfile({ ...profile, headline: event.target.value })} /></label><label>Biography<textarea required minLength="10" maxLength="5000" rows="5" value={profile.biography} onChange={(event) => setProfile({ ...profile, biography: event.target.value })} /></label><label>Contact email<input required type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} /></label><label>Profile image <span className="field-note">JPEG, PNG, WebP or GIF · max 5 MB</span><span className="file-input"><ImagePlus size={17} /><span>{profileImage?.name || (profile.profile_image ? 'Choose a new image' : 'Choose an image')}</span><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => setProfileImage(event.target.files?.[0] || null)} /></span></label><div className="settings-divider"><span>Social links</span></div>{['github', 'linkedin', 'instagram'].map((name) => <label key={name}>{name}<input type="url" placeholder="https://" value={profile.social_links?.[name] || ''} onChange={(event) => setProfile({ ...profile, social_links: { ...profile.social_links, [name]: event.target.value } })} /></label>)}<button className="button button-primary form-submit">Save profile <Check size={16} /></button></form>
            <form className="dashboard-panel settings-form" onSubmit={changePassword}><div className="panel-title"><div><h2>Change password</h2><p>Use a unique password with at least 12 characters.</p></div></div><label>Current password<input type="password" autoComplete="current-password" required value={passwordForm.current_password} onChange={(event) => setPasswordForm({ ...passwordForm, current_password: event.target.value })} /></label><label>New password<input type="password" autoComplete="new-password" minLength="12" maxLength="128" required value={passwordForm.new_password} onChange={(event) => setPasswordForm({ ...passwordForm, new_password: event.target.value })} /></label>{passwordNotice && <div className="notice notice-error">{passwordNotice}</div>}<button className="button button-secondary form-submit">Update password <LockKeyhole size={16} /></button></form></section>}
        </div>
      </main>
      <footer className="mobile-admin-footer"><button onClick={signOut}><LogOut size={16} />Sign out</button><a href="/"><ArrowLeft size={16} />Portfolio</a></footer>
    </div>
  );
}

function ProtectedAdmin() {
  return localStorage.getItem(TOKEN_KEY) ? <AdminPanel /> : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return <Routes><Route path="/" element={<PublicPortfolio />} /><Route path="/admin/login" element={localStorage.getItem(TOKEN_KEY) ? <Navigate to="/admin" replace /> : <AdminLogin />} /><Route path="/admin" element={<ProtectedAdmin />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
}
