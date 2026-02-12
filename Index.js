document.addEventListener('DOMContentLoaded', () => {
    const studentList = document.getElementById('student-list');
    const addStudentBtn = document.getElementById('add-student-btn');
    const studentNameInput = document.getElementById('student-name');
    const submitAttendanceBtn = document.getElementById('submit-attendance');
    const recordsDiv = document.getElementById('records');
    const resetSessionBtn = document.getElementById('reset-session');

    let students = JSON.parse(localStorage.getItem('students')) || [];
    let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];

    // Render student list
    function renderStudents() {
        studentList.innerHTML = '';
        students.forEach((student, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${student.name}</span>
                <div class="attendance-btns">
                    <button class="present" data-index="${index}">Present</button>
                    <button class="absent" data-index="${index}">Absent</button>
                </div>
            `;
            studentList.appendChild(li);
        });
    }

    // Add student
    addStudentBtn.addEventListener('click', () => {
        const name = studentNameInput.value.trim();
        if (name) {
            students.push({ name, attendance: [] });
            localStorage.setItem('students', JSON.stringify(students));
            studentNameInput.value = '';
            renderStudents();
        }
    });

    // Mark attendance
    studentList.addEventListener('click', (e) => {
        if (e.target.classList.contains('present') || e.target.classList.contains('absent')) {
            const index = e.target.dataset.index;
            const status = e.target.classList.contains('present') ? 'Present' : 'Absent';
            students[index].attendance.push(status);
            localStorage.setItem('students', JSON.stringify(students));
            alert(`${students[index].name} marked as ${status}`);
        }
    });

    // Submit attendance (save to records)
    submitAttendanceBtn.addEventListener('click', () => {
        const session = new Date().toLocaleString();
        const record = { session, data: students.map(s => ({ name: s.name, status: s.attendance[s.attendance.length - 1] || 'Not Marked' })) };
        attendanceRecords.push(record);
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
        renderRecords();
        // Reset attendance for next session
        students.forEach(s => s.attendance = []);
        localStorage.setItem('students', JSON.stringify(students));
        renderStudents();
    });

    // Render records
    function renderRecords() {
        recordsDiv.innerHTML = '';
        attendanceRecords.forEach(record => {
            const div = document.createElement('div');
            div.className = 'record';
            div.innerHTML = `<strong>${record.session}</strong><br>${record.data.map(d => `${d.name}: ${d.status}`).join('<br>')}`;
            recordsDiv.appendChild(div);
        });
    }

    // Reset session
    resetSessionBtn.addEventListener('click', () => {
        attendanceRecords = [];
        localStorage.removeItem('attendanceRecords');
        renderRecords();
    });

    // Initial render
    renderStudents();
    renderRecords();
});
