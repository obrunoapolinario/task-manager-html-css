// JavaScript
$(document).ready(function () {
    const savedColor = localStorage.getItem('backgroundColor');
    if (savedColor) {
        $('body').css('backgroundColor', savedColor);
        $('.footer').css('backgroundColor', savedColor);
    }

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let showCompleted = false;

    const updateUI = () => {
        const uncompletedCount = tasks.filter(task => !task.completed).length;
        const completedCount = tasks.length - uncompletedCount;
        
        if (showCompleted) {
            $('.footer__label').text(`Realizadas (${completedCount})`);
            $('.zoom-icon').attr('src', './public/img/zoom-out-icon.png');
        } else {
            $('.footer__label').text(`A fazer (${uncompletedCount})`);
            $('.zoom-icon').attr('src', './public/img/zoom-in-icon.png');
        }
    };

    $('.toggle-completed').on('click', function() {
        showCompleted = !showCompleted;
        renderTasks();
    });

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateUI()
    };

    $('.color-square').on('click', function () {
        const color = window.getComputedStyle(this).backgroundColor;
        $('body').css('backgroundColor', color);
        $('.footer').css('backgroundColor', color);
        localStorage.setItem('backgroundColor', color);
    });

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
            renderTasks();
            saveTasks();
        }
    });

    const renderTasks = () => {
        $('.task-list').empty();

        const uncompletedTasks = tasks.filter(task => !task.completed);
        uncompletedTasks.forEach(renderTask);

        if (showCompleted) {
            const completedTasks = tasks.filter(task => task.completed);
            completedTasks.forEach(renderTask);
        }

        updateUI()
    }

    $('.task-list').on('change', '.task-checkbox', function () {
        const id = $(this).closest('.task').data('id');
        const task = tasks.find(task => task.id === id);
        const wasCompleted = task.completed;
        task.completed = $(this).is(':checked');
    
        task.expanded = false;
        renderTasks();
        saveTasks();
    });

    $('.task-list').on('click', '.task-expand', function () {
        const $task = $(this).closest('.task');
        const $taskBody = $task.find('.task-body');
        const id = $task.data('id');
        const task = tasks.find(task => task.id === id);

        task.expanded = !task.expanded;

        if (task.expanded) {
            $taskBody.addClass('expanded');
            $(this).text('▲');
        } else {
            $taskBody.removeClass('expanded');
            $(this).text('▼');
        }
        saveTasks();
    });

    $('.task-list').on('change', '.task-priority', function () {
        const $task = $(this).closest('.task');
        const newPriority = $(this).val();
        const id = $task.data('id');
        const task = tasks.find(task => task.id === id);

        task.priority = newPriority;
        $task.removeClass('task--priority-low task--priority-medium task--priority-high');

        if (newPriority !== 'none') {
            $task.addClass(`task--priority-${newPriority}`);
        }
        saveTasks();
    });

    $('.task-list').on('input', '.task-observations', function () {
        const id = $(this).closest('.task').data('id');
        const task = tasks.find(task => task.id === id);
        task.observations = $(this).val();
        saveTasks();
    });

    $('.task-list').on('click', '.task-delete', function () {
        const id = $(this).closest('.task').data('id');
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
        saveTasks();
    });

    const renderTask = (task) => {
        const taskHTML = `
            <div class="task" data-id="${task.id}">
                <div class="task-priority-indicator"></div>
                <div class="task-header">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-description ${task.completed ? "task-completed" : ""}">${task.description}</span>
                    <button class="task-expand ${task.expanded ? 'expanded' : ''}">▼</button>
                </div>
                <div class="task-body ${task.expanded ? 'expanded' : ''}">
                    <div class="task-field">
                        <label for="task-observations-${task.id}" class="task-field__label">Observações:</label>
                        <textarea id="task-observations-${task.id}" class="task-observations" ${task.completed ? "disabled" : ""}>${task.observations}</textarea>
                    </div>
                    <div class="task-field-container">
                        <div class="task-field">
                            <label for="task-priority-${task.id}" class="task-field__label">Prioridade</label>
                            <select id="task-priority-${task.id}" class="task-priority" ${task.completed ? "disabled" : ""}>
                                <option value="none" ${task.priority === 'none' ? 'selected' : ''}>Nenhuma</option>
                                <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Baixa</option>
                                <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Média</option>
                                <option value="high" ${task.priority === 'high' ? 'selected' : ''}>Alta</option>
                            </select>
                        </div>
                        <div class="delete-button-container">
                            ${task.completed ? '<button class="task-delete">Excluir</button>' : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        const $task = $(taskHTML);
        if (task.priority !== 'none') {
            $task.addClass(`task--priority-${task.priority}`);
        }
        $('.task-list').append($task);
    }
    renderTasks();
});