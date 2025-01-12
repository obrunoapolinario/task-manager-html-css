// JavaScript
$(document).ready(function () {
    $('.color-square').on('click', function () {
        const color = window.getComputedStyle(this).backgroundColor;
        $('body').css('backgroundColor', color);
        localStorage.setItem('backgroundColor', color);
    });

    let tasks = [];

    const logTasks = () => {
        console.log(tasks);
    }

    $('.task-input').on('keypress', function (e) {
        if (e.key === 'Enter' && $(this).val().trim()) {
            const task = {
                id: tasks.length + 1,
                description: $(this).val().trim(),
                completed: false,
                priority: 'none',
                observations: '',
                expanded: false
            };

            tasks.push(task);
            $(this).val('');
            logTasks();
        }
    });
});