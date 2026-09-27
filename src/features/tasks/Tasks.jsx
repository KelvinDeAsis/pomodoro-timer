import { useState } from 'react';
import { useApp } from '../../app/AppContext.jsx';
import Icon from '../../components/Icon.jsx';
import styles from './Tasks.module.css';
export default function Tasks() {
  const { state, dispatch } = useApp();
  const [text, setText] = useState('');
  const tasks = state.tasks;
  const setTasks = tasks => dispatch({ type: 'TASKS', tasks });
  return <section className={`panel ${styles.tasks}`} aria-labelledby="tasks-title"><div className="section-title"><h2 id="tasks-title">Little to-dos</h2><span className="badge">{tasks.filter(t => !t.done).length} left</span></div><p className="muted">Big plans. Small steps.</p>
    <form className={styles.form} onSubmit={e => { e.preventDefault(); if (text.trim()) { setTasks([...tasks, { id: crypto.randomUUID(), text: text.trim(), done: false }]); setText(''); } }}><input aria-label="New task" placeholder="One thing to work on…" maxLength={120} value={text} onChange={e => setText(e.target.value)} /><button className="button small" type="submit" aria-label="Add task">+</button></form>
    <ul className={styles.list}>{tasks.map(task => <li key={task.id} className={task.done ? styles.done : ''}><label><input type="checkbox" checked={task.done} onChange={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, done: !t.done } : t))} /><span>{task.text}</span></label><button className="icon-button" aria-label={`Delete ${task.text}`} onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}><Icon name="trash" size={16} /></button></li>)}</ul>
    {!tasks.length && <div className={styles.empty}><span className={styles.rule} /><p>A fresh little page.<br />What’s your first small step?</p></div>}
    {tasks.length > 0 && tasks.some(t => t.done) && <button className="text-button" onClick={() => setTasks(tasks.filter(t => !t.done))}>Clear completed</button>}
  </section>;
}
