// HTML 요소들을 변수로 가져옵니다.
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');

// 새로운 할 일 아이템을 만드는 함수
function createTodoItem(text, completed) {
    const listItem = document.createElement('li');
    
    // 텍스트 노드를 따로 생성하여 버튼과 분리합니다.
    const textNode = document.createTextNode(text);
    listItem.appendChild(textNode);
    
    if (completed) {
        listItem.classList.add('completed');
    }

    // 편집 버튼 추가
    const editButton = document.createElement('button');
    editButton.textContent = '수정';
    editButton.classList.add('edit-button');
    listItem.appendChild(editButton);

    return listItem;
}

// 할 일 목록을 로컬 스토리지에 저장하는 함수
function saveTodos() {
    const todos = [];
    const todoItems = todoList.querySelectorAll('li:not(.tutorial)');

    todoItems.forEach(function(item) {
        // li 요소에서 가장 첫 번째 노드(텍스트)의 값을 가져옵니다.
        const textContent = item.firstChild.nodeValue.trim();
        todos.push({
            text: textContent,
            completed: item.classList.contains('completed')
        });
    });

    localStorage.setItem('todos', JSON.stringify(todos));
    updateTutorialMessage();
}

// 웹페이지가 로드될 때 할 일 목록을 불러오는 함수
function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todoList.innerHTML = '';

    todos.forEach(function(todo) {
        const listItem = createTodoItem(todo.text, todo.completed);
        todoList.appendChild(listItem);
    });

    updateTutorialMessage();
}

// 할 일 목록에 따라 안내 문구를 표시하거나 숨기는 함수
function updateTutorialMessage() {
    const todoItems = todoList.querySelectorAll('li:not(.tutorial)');
    if (todoItems.length === 0) {
        const tutorialMessage = `
            <li class="tutorial">할 일을 추가하려면 아래 입력창에 내용을 입력하고 '추가' 버튼을 누르세요.</li>
            <li class="tutorial">할 일을 완료하려면 항목을 <strong>좌클릭</strong>하세요.</li>
            <li class="tutorial">할 일을 삭제하려면 항목을 <strong>우클릭</strong>하세요.</li>
            <li class="tutorial">할 일 내용을 수정하려면 <strong>'수정'</strong> 버튼을 누르세요.</li>
        `;
        todoList.innerHTML = tutorialMessage;
    } else {
        const tutorialItems = todoList.querySelectorAll('.tutorial');
        tutorialItems.forEach(item => item.remove());
    }
}

// '추가' 버튼을 클릭했을 때 실행될 함수
addButton.addEventListener('click', function() {
    const todoText = todoInput.value.trim();
    if (todoText === '') {
        return;
    }
    const newTodoItem = createTodoItem(todoText, false);
    todoList.appendChild(newTodoItem);
    todoInput.value = '';
    saveTodos();
});

// 할 일 아이템을 좌클릭했을 때 (완료/미완료)
todoList.addEventListener('click', function(event) {
    if (event.target.tagName === 'LI' && !event.target.classList.contains('tutorial')) {
        event.target.classList.toggle('completed');
        saveTodos();
    }
});

// 할 일 아이템을 우클릭했을 때 (삭제)
todoList.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    if (event.target.tagName === 'LI' && !event.target.classList.contains('tutorial')) {
        event.target.remove();
        saveTodos();
    }
});

// 편집 버튼 클릭 시 기능
todoList.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit-button')) {
        const listItem = event.target.parentNode;
        
        // 편집 모드 상태 토글
        const isEditing = listItem.classList.toggle('editing');

        // 편집 모드 시작 또는 종료
        if (isEditing) {
            listItem.setAttribute('contenteditable', 'true');
            event.target.textContent = '완료';
            listItem.firstChild.focus(); // 텍스트에 포커스
            document.execCommand('selectAll', false, null); // 텍스트 전체 선택
        } else {
            listItem.setAttribute('contenteditable', 'false');
            event.target.textContent = '수정';
            saveTodos();
        }
    }
});

// 편집 모드 종료 시 데이터 저장 (Enter 키 또는 포커스 잃었을 때)
todoList.addEventListener('blur', function(event) {
    const listItem = event.target;
    if (listItem.tagName === 'LI' && !listItem.classList.contains('tutorial') && listItem.classList.contains('editing')) {
        listItem.setAttribute('contenteditable', 'false');
        listItem.classList.remove('editing');
        const editButton = listItem.querySelector('.edit-button');
        if (editButton) {
            editButton.textContent = '수정';
        }
        saveTodos();
    }
}, true);

// 로컬 스토리지에서 할 일 목록을 불러옵니다.
loadTodos();