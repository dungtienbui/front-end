import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Table, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = 'http://localhost:3001/doctors';

function DoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({ name: '', specialization: '', phone: '' });
  const [editDoctor, setEditDoctor] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(API_BASE_URL);
        setDoctors(response.data);
      } catch (error) {
        alert('An error occurred while fetching doctors');
      }
    };

    fetchDoctors();
  }, []);

  const handleAddDoctor = async () => {
    try {
      const response = await axios.post(API_BASE_URL, newDoctor);
      setDoctors([...doctors, response.data]);
      setNewDoctor({ name: '', specialization: '', phone: '' });
      setShowAddModal(false);
      alert('Doctor added successfully!');
    } catch (error) {
      alert('An error occurred while adding the doctor');
    }
  };

  const handleUpdateDoctor = async () => {
    if (editDoctor) {
      try {
        const response = await axios.put(`${API_BASE_URL}/${editDoctor.id}`, editDoctor);
        setDoctors(doctors.map(doctor => doctor.id === response.data.id ? response.data : doctor));
        setShowEditModal(false);
        alert('Doctor updated successfully!');
      } catch (error) {
        alert('An error occurred while updating the doctor');
      }
    }
  };

  const handleDeleteDoctor = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setDoctors(doctors.filter(doctor => doctor.id !== id));
      alert('Doctor deleted successfully!');
    } catch (error) {
      alert('An error occurred while deleting the doctor');
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Doctor Management</h1>
      <Button className="btn btn-primary mb-3" onClick={() => setShowAddModal(true)}>Add New Doctor</Button>

      <Table bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialization</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map(doctor => (
            <tr key={doctor.id}>
              <td>{doctor.name}</td>
              <td>{doctor.specialization}</td>
              <td>{doctor.phone}</td>
              <td>
                <Button className="btn btn-warning btn-sm me-2" onClick={() => {
                  setEditDoctor({ ...doctor });
                  setShowEditModal(true);
                }}>Edit</Button>
                <Button className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteDoctor(doctor.id)}>Delete</Button>
                <Link to={`/doctors/${doctor.id}`} className="btn btn-info btn-sm">View Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Doctor Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Specialization</Form.Label>
              <Form.Control
                type="text"
                value={newDoctor.specialization}
                onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={newDoctor.phone}
                onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddDoctor}>Add Doctor</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Doctor Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editDoctor?.name || ''}
                onChange={(e) => setEditDoctor({ ...editDoctor, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Specialization</Form.Label>
              <Form.Control
                type="text"
                value={editDoctor?.specialization || ''}
                onChange={(e) => setEditDoctor({ ...editDoctor, specialization: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={editDoctor?.phone || ''}
                onChange={(e) => setEditDoctor({ ...editDoctor, phone: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleUpdateDoctor}>Update Doctor</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DoctorManagement;
