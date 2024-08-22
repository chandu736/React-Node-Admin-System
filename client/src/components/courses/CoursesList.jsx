import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaPlus, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import Header from '../dashboard/Header';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [sortField, setSortField] = useState('CourseID');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortField, sortOrder, search, statusFilter]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses/fetch', {
        params: {
          page,
          pageSize,
          sortColumn: sortField,
          sortOrder,
          filter: search,
          status: statusFilter === 'All' ? undefined : statusFilter,
        },
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'ASC' ? 'DESC' : 'ASC';
    setSortField(field);
    setSortOrder(order);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await axios.put(`http://localhost:5000/api/courses/edit-status/${id}`, { Status: newStatus });
      alert('Course status updated successfully');
      fetchCourses();
    } catch (error) {
      console.error('Error updating course status: ', error);
      alert('Error updating course status');
    }
  };

  const handleDelete = async (courseID) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`http://localhost:5000/api/courses/delete/${courseID}`);
        alert('Course deleted successfully');
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course: ', error);
        alert('Error deleting course');
      }
    }
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortOrder === 'ASC' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  return (
    <>
      <Header welcomeMessage="Courses List" />
      <div className="container mt-5">
        <div className="row mb-3 align-items-center">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search by Title"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select mb-3"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="col-md-6 text-end">
            <Link to="/create-course">
              <button className="btn btn-outline-primary"><FaPlus className="me-1" />Add Course</button>
            </Link>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Image</th>
                <th
                  onClick={() => handleSort('Title')}
                  style={{ cursor: 'pointer', color: sortField === 'Title' ? 'blue' : 'inherit' }}
                >
                  Course Title {getSortIcon('Title')}
                </th>
                <th
                  onClick={() => handleSort('CreditPoints')}
                  style={{ cursor: 'pointer', color: sortField === 'CreditPoints' ? 'blue' : 'inherit' }}
                >
                  Credit Points {getSortIcon('CreditPoints')}
                </th>
                <th
                  onClick={() => handleSort('Status')}
                  style={{ cursor: 'pointer', color: sortField === 'Status' ? 'blue' : 'inherit' }}
                >
                  Status {getSortIcon('Status')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.CourseID}>
                  <td className="text-center">
                    <img
                      src={`http://localhost:5000/uploads/${course.Image || 'default-image.jpg'}`}
                      alt={course.Title}
                      className="img-fluid"
                      style={{ maxWidth: '100px' }}
                      data-bs-toggle="tooltip"
                      title={course.Title}
                    />
                  </td>
                  <td>
                    <a href={course.SourceLink} target="_blank" rel="noopener noreferrer" data-bs-toggle="tooltip" title="Click to view source">
                      {course.Title}
                    </a>
                  </td>
                  <td>{course.CreditPoints}</td>
                  <td className="text-center">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={course.Status === 'Active'}
                        onChange={() => handleStatusToggle(course.CourseID, course.Status)}
                      />
                      <label className="form-check-label">
                        {course.Status}
                      </label>
                    </div>
                  </td>
                  <td className="text-center">
                    <Link to={`/courses/${course.CourseID}`}>
                      <button className="btn btn-info btn-sm">View</button>
                    </Link>{' '}
                    <Link to={`/edit-course/${course.CourseID}`}>
                      <button className="btn btn-info btn-sm">Edit</button>
                    </Link>{' '}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(course.CourseID)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between">
          <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="btn btn-secondary">
            Previous
          </button>
          <span>Page {page}</span>
          <button onClick={() => handlePageChange(page + 1)} className="btn btn-secondary">
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default CourseList;
