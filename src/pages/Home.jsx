import { useState, useRef } from 'react';
import SecretsDisplay from '../components/SecretsDisplay';
import Section from '../components/Section';
import ConfirmModal from '../components/Modal';
import { apiCall, parseError, API_BASE } from '../utils/api';

function LoadingBtn({ loading, className, onClick, children }) {
  return (
    <button
      className={`btn ${className} ${loading ? 'btn-loading' : ''}`}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <span className="btn-dots">
          <span /><span /><span />
        </span>
      ) : children}
    </button>
  );
}

export default function Home({ auth, onNav, addToast }) {
  const [secrets, setSecrets]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const [filterScore, setFilterScore] = useState('');
  const [allPage, setAllPage]         = useState(1);
  const [byId, setById]               = useState('');
  const [newSecret, setNewSecret]     = useState({ secret: '', score: '' });
  const [updateData, setUpdateData]   = useState({ id: '', secret: '', score: '' });
  const [patchData, setPatchData]     = useState({ id: '', secret: '', score: '' });
  const [deleteId, setDeleteId]       = useState('');
  const [deleteModal, setDeleteModal] = useState(false);

  const resultsRef = useRef(null);

  const run = async (fn, sectionKey) => {
    setLoading(true);
    setActiveSection(sectionKey);
    setSecrets([]);
    try {
      const [data, message] = await fn();
      setSecrets(data);
      if (message) addToast('info', message);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    } catch (e) {
      addToast('error', parseError(e));
    } finally {
      setLoading(false);
    }
  };

  const needAuth = () => !auth && [[], null];

  // ── API calls ────────────────────────────────────────────────────────────────

  const getRandom = () =>
    run(async () => {
      const d = await apiCall('GET', `${API_BASE}/random`);
      return [[d], null];
    }, 'random');

  const getFilter = () =>
    run(async () => {
      if (!filterScore) { addToast('warning', 'Enter a minimum score first.'); return [[], null]; }
      const { apiKey } = await apiCall('GET', `${API_BASE}/generate-api-key`);
      const d = await apiCall('GET', `${API_BASE}/filter?score=${filterScore}&apiKey=${apiKey}`);
      return [Array.isArray(d) ? d : [d], null];
    }, 'filter');

  const getAll = () =>
    run(async () => {
      const early = needAuth(); if (early[0] === [] && !auth) { addToast('warning', 'Please log in first.'); return early; }
      const d = await apiCall('GET', `${API_BASE}/all?page=${allPage}`, null, {
        basic: { username: auth.username, password: auth.password },
      });
      return [Array.isArray(d) ? d : [d], null];
    }, 'all');

  const getMySecrets = () =>
    run(async () => {
      const d = await apiCall('GET', `${API_BASE}/user-secrets`, null, { bearer: auth.token });
      const arr = Array.isArray(d) ? d : [d];
      if (arr.length === 0) addToast('info', "You haven't added any secrets yet!");
      return [arr, null];
    }, 'mine');

  const getById = () =>
    run(async () => {
      if (!byId) { addToast('warning', 'Enter a Secret ID.'); return [[], null]; }
      const d = await apiCall('GET', `${API_BASE}/secrets/${byId}`, null, { bearer: auth.token });
      return [[d], null];
    }, 'byId');

  const addSecret = () =>
    run(async () => {
      if (!newSecret.secret || !newSecret.score) { addToast('warning', 'Fill in both fields.'); return [[], null]; }
      const d = await apiCall('POST', `${API_BASE}/secrets`,
        { secret: newSecret.secret, score: Number(newSecret.score) },
        { bearer: auth.token }
      );
      setNewSecret({ secret: '', score: '' });
      addToast('success', 'Secret added successfully!');
      return [[d], null];
    }, 'add');

  const doUpdate = () =>
    run(async () => {
      if (!updateData.id) { addToast('warning', 'Enter a Secret ID.'); return [[], null]; }
      const d = await apiCall('PUT', `${API_BASE}/secrets/${updateData.id}`,
        { secret: updateData.secret, score: Number(updateData.score) },
        { bearer: auth.token }
      );
      addToast('success', 'Secret updated (full replace)!');
      return [[d], null];
    }, 'update');

  const doPatch = () =>
    run(async () => {
      if (!patchData.id) { addToast('warning', 'Enter a Secret ID.'); return [[], null]; }
      const body = {};
      if (patchData.secret) body.secret = patchData.secret;
      if (patchData.score)  body.score  = Number(patchData.score);
      const d = await apiCall('PATCH', `${API_BASE}/secrets/${patchData.id}`, body, { bearer: auth.token });
      addToast('success', 'Secret patched!');
      return [[d], null];
    }, 'patch');

  const confirmDelete = () => {
    if (!deleteId) { addToast('warning', 'Enter a Secret ID to delete.'); return; }
    setDeleteModal(true);
  };

  const doDelete = async () => {
    setDeleteModal(false);
    setLoading(true);
    setActiveSection('delete');
    setSecrets([]);
    try {
      await apiCall('DELETE', `${API_BASE}/secrets/${deleteId}`, null, { bearer: auth.token });
      setDeleteId('');
      addToast('success', 'Secret deleted successfully.');
    } catch (e) {
      addToast('error', parseError(e));
    } finally {
      setLoading(false);
    }
  };

  const upd = (setter, field) => (e) =>
    setter((f) => ({ ...f, [field]: e.target.value }));

  const isLoading = (key) => loading && activeSection === key;

  return (
    <div>
      {/* ── PUBLIC ── */}
      <div className="blocks-grid">
        <Section icon="🌐" title="Random Secret" defaultOpen={true}>
          <LoadingBtn loading={isLoading('random')} className="btn-gold" onClick={getRandom}>
            🎲 Get Random Secret
          </LoadingBtn>
        </Section>

        <Section icon="🔍" title="Filter by Score">
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 160 }}>
              <label>Min Embarrassment Score</label>
              <input
                type="number" value={filterScore} min="1" max="10"
                onChange={(e) => setFilterScore(e.target.value)}
                placeholder="e.g. 5"
              />
            </div>
            <LoadingBtn loading={isLoading('filter')} className="btn-primary" onClick={getFilter}>
              🔍 Filter
            </LoadingBtn>
          </div>
        </Section>
      </div>

      {auth ? (
        <>
          <hr className="divider" />
          <div className="blocks-grid">

            {/* BASIC AUTH */}
            <Section icon="🔑" title="Get All Secrets" badge="BASIC AUTH">
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ marginBottom: 0, width: 110 }}>
                  <label>Page</label>
                  <input type="number" value={allPage} min="1" onChange={(e) => setAllPage(e.target.value)} />
                </div>
                <LoadingBtn loading={isLoading('all')} className="btn-primary" onClick={getAll}>
                  📜 Get All
                </LoadingBtn>
              </div>
            </Section>

            {/* MY SECRETS */}
            <Section icon="🙋" title="My Secrets" badge="BEARER">
              <LoadingBtn loading={isLoading('mine')} className="btn-outline" onClick={getMySecrets}>
                🙋 View My Secrets
              </LoadingBtn>
            </Section>

            {/* GET BY ID */}
            <Section icon="🔎" title="Get Secret by ID" badge="BEARER">
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ marginBottom: 0, width: 150 }}>
                  <label>Secret ID</label>
                  <input type="number" value={byId} onChange={(e) => setById(e.target.value)} placeholder="e.g. 42" />
                </div>
                <LoadingBtn loading={isLoading('byId')} className="btn-primary" onClick={getById}>
                  🔎 Fetch
                </LoadingBtn>
              </div>
            </Section>

            {/* ADD SECRET */}
            <Section icon="➕" title="Add New Secret" badge="POST">
              <div className="row-form">
                <div className="form-group">
                  <label>Secret Text</label>
                  <input type="text" value={newSecret.secret} onChange={upd(setNewSecret, 'secret')} placeholder="Your secret confession..." />
                </div>
                <div className="form-group" style={{ maxWidth: 130 }}>
                  <label>Score (1–10)</label>
                  <input type="number" value={newSecret.score} onChange={upd(setNewSecret, 'score')} placeholder="7" min="1" max="10" />
                </div>
                <LoadingBtn loading={isLoading('add')} className="btn-gold" onClick={addSecret}>
                  ✅ Add
                </LoadingBtn>
              </div>
            </Section>

            {/* UPDATE (PUT) */}
            <Section icon="✏️" title="Full Update (PUT)" badge="PUT">
              <div className="row-form">
                <div className="form-group" style={{ maxWidth: 90 }}>
                  <label>ID</label>
                  <input type="number" value={updateData.id} onChange={upd(setUpdateData, 'id')} />
                </div>
                <div className="form-group">
                  <label>New Secret</label>
                  <input type="text" value={updateData.secret} onChange={upd(setUpdateData, 'secret')} placeholder="Replacement text" />
                </div>
                <div className="form-group" style={{ maxWidth: 110 }}>
                  <label>New Score</label>
                  <input type="number" value={updateData.score} onChange={upd(setUpdateData, 'score')} min="1" max="10" />
                </div>
                <LoadingBtn loading={isLoading('update')} className="btn-primary" onClick={doUpdate}>
                  💾 Update
                </LoadingBtn>
              </div>
            </Section>

            {/* PATCH */}
            <Section icon="🧩" title="Partial Update (PATCH)" badge="PATCH">
              <div className="row-form">
                <div className="form-group" style={{ maxWidth: 90 }}>
                  <label>ID</label>
                  <input type="number" value={patchData.id} onChange={upd(setPatchData, 'id')} />
                </div>
                <div className="form-group">
                  <label>Secret (optional)</label>
                  <input type="text" value={patchData.secret} onChange={upd(setPatchData, 'secret')} placeholder="Leave blank to keep" />
                </div>
                <div className="form-group" style={{ maxWidth: 110 }}>
                  <label>Score (optional)</label>
                  <input type="number" value={patchData.score} onChange={upd(setPatchData, 'score')} min="1" max="10" />
                </div>
                <LoadingBtn loading={isLoading('patch')} className="btn-gold" onClick={doPatch}>
                  ⚙️ Patch
                </LoadingBtn>
              </div>
            </Section>

            {/* DELETE */}
            <Section icon="🗑️" title="Delete Secret" badge="DELETE">
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ maxWidth: 150, marginBottom: 0 }}>
                  <label>Secret ID</label>
                  <input type="number" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} placeholder="e.g. 42" />
                </div>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  🗑️ Delete
                </button>
              </div>
            </Section>

          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '36px 0 10px' }}>
          <div style={{ fontSize: '2rem', marginBottom: 12, opacity: 0.4 }}>🔐</div>
          <p style={{ color: 'var(--text-dim)', marginBottom: 20, fontSize: '0.9rem', lineHeight: 1.6 }}>
            Log in to unlock all endpoints —<br />manage, create, and delete your secrets.
          </p>
          <button className="btn btn-gold" style={{ marginRight: 10 }} onClick={() => onNav('login')}>
            🔑 Login
          </button>
          <button className="btn btn-outline" onClick={() => onNav('register')}>
            📝 Register
          </button>
        </div>
      )}

      {/* ── Results ── */}
      {(loading || secrets.length > 0) && (
        <>
          <hr className="divider" />
          <div ref={resultsRef}>
            <SecretsDisplay secrets={secrets} loading={loading} />
          </div>
        </>
      )}

      <ConfirmModal
        open={deleteModal}
        secretId={deleteId}
        onConfirm={doDelete}
        onCancel={() => setDeleteModal(false)}
      />
    </div>
  );
}
