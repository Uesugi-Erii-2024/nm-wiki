function createTimetableToggle(containerId, renderFn) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const btn = document.createElement("button");
  btn.textContent = "📅 点击查看高二课表";
  btn.style.cssText = "padding:6px 12px; border:none; background:#1976d2; color:white; border-radius:4px; cursor:pointer;";

  const box = document.createElement("div");
  box.style.display = "none";
  box.style.marginTop = "10px";
  container.appendChild(btn);
  container.appendChild(box);

  let visible = false;
  btn.addEventListener("click", () => {
    visible = !visible;
    box.style.display = visible ? "block" : "none";
    btn.textContent = visible ? "📅 收起高二课表" : "📅 点击查看高二课表";
    if (visible && box.innerHTML === "") {
      renderFn(box); // 渲染课表内容到 box
    }
  });
}