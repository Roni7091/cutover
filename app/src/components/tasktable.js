import React, { useState , useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../Styles/tasktable.css";
import Sidebar from "../components/sidebar";
import { FcNext, FcPrevious } from "react-icons/fc";
import * as XLSX from "xlsx";
import axios from 'axios';

function Tasktable() {
  const [taskFormVisible, setTaskFormVisible] = useState(false);
 

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    taskId: '',
    taskName: '',
    assignedTo: '',
    priority: 'Low',
    dueDate: '',
    completion: 0,
  });




  const handleAddTaskClick = () => {
    setTaskFormVisible(true);
  };

  const handleFormInputChange = (event) => {
    const { name, value } = event.target;
    setNewTask({
      ...newTask,
      [name]: value,
    });
  };

  

  
  const handleSubmitTask = async () => {
    try {
      const response = await axios.post('http://localhost:3005/api/tasks', newTask);
      setTasks([...tasks, response.data]);
      setTaskFormVisible(false);
      setNewTask({
        taskId: '',
        taskName: '',
        assignedTo: '',
        priority: 'Low',
        dueDate: '',
        completion: 0,
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3005/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  async function downloadPDF() {
    const input = document.getElementById("table-to-export");
    if (!input) {
      console.error("Element with id 'table-to-export' not found.");
      return;
    }

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("table-data.pdf");
  }

  const [sliderValue, setSliderValue] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 9;

  const handleSliderChange = (event) => {
    const value = event.target.value;
    setSliderValue(value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tasks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Task List");
    XLSX.writeFile(workbook, "task-list.xlsx");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0]; // Assuming you want to read the first sheet
      const sheet = workbook.Sheets[sheetName];

      const excelData = XLSX.utils.sheet_to_json(sheet);

      // Update the state with the Excel data
      setTasks(excelData);
    };

    reader.readAsArrayBuffer(file);
  };
  return (
    <div>
      <div className="Header">
        <div className="container header-container">
          <div className="row">
            <div className="col-4">
              <h4>Task List</h4>
            </div>
            <div className="col-8 d-flex justify-content-end">
              <button
                type="button"
                className="btn header-btn ms-4"
                onClick={handleAddTaskClick}
              >
                Add Task
              </button>
              <label htmlFor="file-upload" className="btn header-btn ms-4">
                Upload
              </label>
              <input
                type="file"
                id="file-upload"
                accept=".xlsx, .xls"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <button
                type="button"
                className="btn header-btn ms-4"
                onClick={downloadPDF}
              >
                downloadPDF
              </button>

              <button
                type="button"
                className="btn header-btn ms-4"
                onClick={downloadExcel}
              >
                Download Excel
              </button>
              <button type="button" className="btn header-btn ms-4">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <Sidebar />
      <div className="Tasktable mt-3">
        <div className="container task-table">
          {taskFormVisible && (
            <div className="task-form">
              <h5>Add Task</h5>
              <form>
                <div className="mb-3">
                  <label htmlFor="taskId" className="form-label">
                    Task ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="taskId"
                    name="taskId"
                    value={newTask.taskId}
                    onChange={handleFormInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="taskName" className="form-label">
                    Task Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="taskName"
                    name="taskName"
                    value={newTask.taskName}
                    onChange={handleFormInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="assignedTo" className="form-label">
                    Assigned To
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="assignedTo"
                    name="assignedTo"
                    value={newTask.assignedTo}
                    onChange={handleFormInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="priority" className="form-label">
                    Priority
                  </label>
                  <select
                    className="form-select"
                    id="priority"
                    name="priority"
                    value={newTask.priority}
                    onChange={handleFormInputChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="dueDate" className="form-label">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="dueDate"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleFormInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="completion" className="form-label">
                    Completion
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    id="completion"
                    name="completion"
                    min="0"
                    max="100"
                    value={newTask.completion}
                    onChange={handleFormInputChange}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmitTask}
                >
                  Submit
                </button>
              </form>
            </div>
          )}

          <div className="table-container" id="table-to-export">
            <table className="table container table-striped">
              <thead>
                <tr>
                  
                  <th scope="col">Task ID</th>
                  <th scope="col">Task Name</th>
                  <th scope="col">Assigned To</th>
                  <th scope="col">Priority</th>
                  <th scope="col">Due Date</th>
                  <th scope="col">Completion</th>
                </tr>
              </thead>
              <tbody>
                {currentTasks.map((task, index) => (
                  <tr key={index}>
                  
                    <td>{task.taskId}</td>
                    <td>{task.taskName}</td>
                    <td>
                      <div className="task-info">
                        <img
                          src={task.iconUrl}
                          alt="Task Icon"
                          className="task-icon"
                        />
                        {task.assignedTo}
                      </div>
                    </td>
                    <td>{task.priority}</td>
                    <td>{task.dueDate}</td>
                    <td className="text-center">
                      <div className="slider-container">
                        <input
                          type="range"
                          value={sliderValue}
                          min="0"
                          max="100"
                          step="1"
                          className="progress"
                          onChange={handleSliderChange}
                        />
                        <span>{sliderValue}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className={`pagination-button ${
                  currentPage === 1 ? "disabled" : ""
                }`}
                disabled={currentPage === 1}
              >
                <FcPrevious />
              </button>
              {Array.from({
                length: Math.ceil(tasks.length / tasksPerPage),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`pagination-button ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className={`pagination-button ${
                  currentPage === Math.ceil(tasks.length / tasksPerPage)
                    ? "disabled"
                    : ""
                }`}
                disabled={
                  currentPage === Math.ceil(tasks.length / tasksPerPage)
                }
              >
                <FcNext />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tasktable;
