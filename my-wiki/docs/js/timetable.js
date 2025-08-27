// 课程数据（二维数组：每行是时间段，每列是星期几）
const courseList = [
    ['语文', '数学', '英语', '物理', '化学'],
    ['历史', '地理', '政治', '生物', '信息技术'],
    ['体育', '美术', '音乐', '班会', '劳动'],
];

// 表头（星期几）
const weekDays = ['周一', '周二', '周三', '周四', '周五'];

// 时间段标签
const timeSlots = ['第一节', '第二节', '第三节'];

// 渲染课表
function renderTimetable(containerId, courses, week, timeLabels) {
    const container = document.getElementById(containerId);
    let html = '<table class="timetable-table"><thead><tr><th>时间</th>';
    week.forEach((day, i) => {
        // 如果是今天则高亮
        const today = (new Date().getDay() === i + 1) ? 'timetable-highlight' : '';
        html += `<th class="${today}">${day}</th>`;
    });
    html += '</tr></thead><tbody>';

    courses.forEach((row, i) => {
        html += `<tr><td class="timetable-time">${timeLabels[i]}</td>`;
        for (let j = 0; j < 5; j++) { // 固定只渲染5列
            const cell = row[j] || '';
            const hasCourse = cell && cell !== '无' ? 'has-course' : '';
            html += `<td class="timetable-cell ${hasCourse}" data-row="${i}" data-col="${j}">${cell && cell !== '无' ? cell : ''}</td>`;
        }
        html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;

    // 添加点击事件
    container.querySelectorAll('.timetable-cell').forEach(td => {
        td.addEventListener('click', function() {
            if (this.textContent.trim()) {
                alert(`你点击了 ${week[this.dataset.col]} 第${parseInt(this.dataset.row)+1}节课：${this.textContent}`);
            }
        });
    });
}

// 页面加载后自动渲染
document.addEventListener('DOMContentLoaded', function() {
    renderTimetable('timetable', courseList, weekDays, timeSlots);
});