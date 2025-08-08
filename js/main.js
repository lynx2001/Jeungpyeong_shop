/* ========== Utilities ========== */
const $ = (sel, root=document) => root.querySelector(sel);
const $all = (sel, root=document) => Array.from(root.querySelectorAll(sel));

/* ========== Year ========== */
(() => {
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();

/* ========== Reveal on view (reduced motion 대응) ========== */
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $all('.reveal').forEach(el => el.classList.add('show'));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('show');
        obs.unobserve(e.target); // 관찰 해제로 성능 최적화
      }
    }
  }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
  $all('.reveal').forEach(el => io.observe(el));
})();

/* ========== Hero video autoplay fallback ========== */
(() => {
  const v = document.getElementById('heroVideo');
  if (!v) return;

  // iOS/모바일 정책: muted + playsinline 필수 (HTML에 이미 있으나 방어적으로 한 번 더)
  v.muted = true;
  v.playsInline = true;

  const fail = () => {
    v.style.display = 'none'; // 비디오 숨김
    // 섹션에 hero-fallback 배경이미지 노출 (CSS로 처리됨)
  };

  // 네트워크/디코딩 오류도 캐치
  v.addEventListener('error', fail, { once: true });
  v.addEventListener('stalled', fail, { once: true });

  const p = v.play?.();
  if (p && typeof p.catch === 'function') p.catch(fail);

  // 탭 비활성화 시 일시정지 → 자원 절약
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) v.pause();
    else v.play().catch(() => {});
  });
})();

// 페이지 로드 시 항상 맨 위(hero)로 이동
window.addEventListener('pageshow', () => {
    location.hash = '#hero';
  });


