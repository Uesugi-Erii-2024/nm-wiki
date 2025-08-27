function loadTimetableFromMarkdown(containerId, mdPath) {
  fetch(mdPath)
    .then(res => res.text())
    .then(md => {
        const weekDays = ['周一', '周二', '周三', '周四', '周五'];
        const lines = md.trim().split('\n').filter(line => line && !line.startsWith('#'));
        const courseList = lines.map(line => line.split(/\s+/).slice(1,6)); // 只取第2~6列
        const timeSlots = lines.map(line => line.split(/\s+/)[0]); // 第1列作为时间
      renderTimetable(containerId, courseList, weekDays, timeSlots);
    });
}

function createTimetableButton(wrapperId, btnText, containerId, mdPath, title) {
  document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.getElementById(wrapperId);
    const btn = document.createElement('button');
    btn.textContent = btnText;
    btn.style.cssText = "padding:6px 12px; border:none; background:#1976d2; color:white; border-radius:4px; cursor:pointer;";
    wrapper.appendChild(btn);

    const tableBox = document.createElement('div');
    tableBox.style.display = "none";
    tableBox.innerHTML = `<h3>${title}</h3><div id="${containerId}"></div>`;
    wrapper.appendChild(tableBox);

    btn.onclick = function() {
      tableBox.style.display = tableBox.style.display === "none" ? "block" : "none";
      btn.textContent = tableBox.style.display === "none" ? btnText : "📅 收起课表";
      if (tableBox.style.display === "block" && !tableBox.dataset.rendered) {
        loadTimetableFromMarkdown(containerId, mdPath);
        tableBox.dataset.rendered = "1";
      }
    };
  });
}

function loadTimetableFromMarkdown(containerId, mdPath) {
  fetch(mdPath)
    .then(res => res.text())
    .then(md => {
      const lines = md.trim().split('\n').filter(line => line && !line.startsWith('#'));
      const courseList = lines.map(line => line.split(/\s+/).slice(1));
      const weekDays = ['周一', '周二', '周三', '周四', '周五'];
      const timeSlots = lines.map(line => line.split(/\s+/)[0]);
      renderTimetable(containerId, courseList, weekDays, timeSlots);
    });
}

function createGradeTimetablePanel(wrapperId) {
  document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.getElementById(wrapperId);
    const grades = [
      { name: '高一', key: '1' },
      { name: '高二', key: '2' },
      { name: '高三', key: '3' }
    ];

    // 年级按钮
    const gradeBtnBox = document.createElement('div');
    gradeBtnBox.style.marginBottom = '12px';
    grades.forEach(grade => {
      const btn = document.createElement('button');
      btn.textContent = grade.name;
      btn.style.cssText = "margin-right:10px;padding:6px 16px;border:none;background:#1976d2;color:white;border-radius:4px;cursor:pointer;";
      let opened = false;
      btn.onclick = function() {
        if (opened) {
          dropdownBox.style.display = 'none';
          timetableBox.innerHTML = '';
          btn.textContent = grade.name;
        } else {
          showDropdown(grade.key, grade.name);
          btn.textContent = `收起`;
        }
        opened = !opened;
      };
      gradeBtnBox.appendChild(btn);
    });
    wrapper.appendChild(gradeBtnBox);

    // 下拉菜单和课表容器
    const dropdownBox = document.createElement('div');
    dropdownBox.style.display = 'none';
    dropdownBox.style.marginBottom = '12px';
    wrapper.appendChild(dropdownBox);

    const timetableBox = document.createElement('div');
    wrapper.appendChild(timetableBox);

    function showDropdown(gradeKey, gradeName) {
      dropdownBox.innerHTML = '';
      dropdownBox.style.display = 'block';
      const label = document.createElement('span');
      label.textContent = `选择${gradeName}课表：`;
      dropdownBox.appendChild(label);

      const select = document.createElement('select');
      for (let i = 1; i <= 10; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = i;
        select.appendChild(opt);
      }
      dropdownBox.appendChild(select);

      select.onchange = function() {
        const num = select.value;
        timetableBox.innerHTML = `<div id="timetable-grade"></div>`;
        const mdPath = `/articles/information/new_student/timetable/timetable_data/senior_${gradeKey}/${num}.txt`;
        loadTimetableFromMarkdown('timetable-grade', mdPath);
      };

      select.value = "1";
      select.onchange();
    }
  });
}