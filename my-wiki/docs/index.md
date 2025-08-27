# 欢迎来到上海市南洋模范中学
<span id="current-time"></span>
<script>
// 实时显示当前时间（每秒更新）
function updateTime() {
    const now = new Date();
    document.getElementById('current-time').innerText = 
        now.toLocaleString('zh-CN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
}
setInterval(updateTime, 1000);
updateTime(); // 立即执行一次
</script>

<!-- ## Commands

* `mkdocs new [dir-name]` - Create a new project.
* `mkdocs serve` - Start the live-reloading docs server.
* `mkdocs build` - Build the documentation site.
* `mkdocs -h` - Print help message and exit.

## Project layout

    mkdocs.yml    # The configuration file.
    docs/
        index.md  # The documentation homepage.
        ...       # Other markdown pages, images and other files. -->



<!-- <iframe src="html/calendar.html" width="100%" height="700"></iframe> -->
<!-- 日历 -->
<link rel="stylesheet" href="css/calendar.css">
<script src="js/calendar.js"></script>

<div class="calendar-header">
    <!-- ...日历结构... -->
    <div class="month-nav">
        <button id="prev-month">‹</button>
        <div class="month-title" id="current-month"></div>
        <button id="next-month">›</button>
    </div>
    <div class="view-options">
        <button id="month-view">月视图</button>
        <button id="week-view">周视图</button>
    </div>
</div>
<div class="calendar-grid" id="calendar-grid"></div>
<div class="overlay" id="overlay"></div>
</div>
<script src="js/calendar.js"></script>
<!-- ____________________________________________________________ -->




