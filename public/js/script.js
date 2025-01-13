// JavaScript
$(document).ready(function () {
    $('.color-square').on('click', function () {
        const color = window.getComputedStyle(this).backgroundColor;
        $('body').css('backgroundColor', color);
        localStorage.setItem('backgroundColor', color);
    });

    let tasks = [];

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
        }
    });

    const renderTasks = () => {
        $('.task-list').empty();

        const uncompletedTasks = tasks.filter(task => !task.completed);
        uncompletedTasks.forEach(renderTask);

        const completedTasks = tasks.filter(task => task.completed);
        completedTasks.forEach(renderTask);
    }

    $('.task-list').on('change', '.task-checkbox', function () {
        const id = $(this).closest('.task').data('id');
        const task = tasks.find(task => task.id === id);
        task.completed = $(this).is(':checked');
        renderTasks();
    });

    $('.task-list').on('click', '.task-expand', function () {
        const id = $(this).closest('.task').data('id');
        const task = tasks.find(task => task.id === id);
        task.expanded = !task.expanded;
        renderTasks();
    });

    $('.task-list').on('change', '.task-priority', function () {
        const $task = $(this).closest('.task');
        const newPriority = $(this).val();

        $task.removeClass('task--priority-low task--priority-medium task--priority-high');

        if (newPriority !== 'none') {
            $task.addClass(`task--priority-${newPriority}`);
        }
    });

    const renderTask = (task) => {
        const taskHTML = `
            <div class="task" data-id="${task.id}">
                <div class="task-priority-indicator"></div>
                <div class="task-header">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-description">${task.description}</span>
                    <button class="task-expand">${task.expanded ? '▲' : '▼'}</button>
                </div>
                <div class="task-body ${task.expanded ? 'expanded' : ''}">
                    <div class="task-field">
                        <label for="task-observations-${task.id}" class="task-field__label">Observações:</label>
                        <textarea id="task-observations-${task.id}" class="task-observations" placeholder="Escreva aqui...">${task.observations}</textarea>
                    </div>
                    <div class="task-field-container">
                        <div class="task-field">
                            <label for="task-priority-${task.id}" class="task-field__label">Prioridade:</label>
                            <select id="task-priority-${task.id}" class="task-priority">
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
});