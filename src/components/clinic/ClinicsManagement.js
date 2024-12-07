import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = 'http://localhost:3001/clinics';
const token = localStorage.getItem('token');

function ClinicsManagement() {
  const [clinics, setClinics] = useState([]);
  const [newClinic, setNewClinic] = useState({ name: '', address: '', phoneNumber: '', openTime: '', closeTime: '' });
  const [editClinic, setEditClinic] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await axios.get(API_BASE_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClinics(response.data);
      } catch (error) {
        console.error('Error fetching clinics:', error);
        alert(error.response?.data?.error || 'An error occurred while fetching the clinics');
      }
    };

    fetchClinics();
  }, []); // Chỉ chạy khi component được mount lần đầu tiên

  const handleAddClinic = async () => {
    try {
      const response = await axios.post(API_BASE_URL, newClinic, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClinics([...clinics, response.data]);
      setNewClinic({ name: '', address: '', phoneNumber: '', openTime: '', closeTime: '' });
      setModalMessage('Clinic added successfully!');
      setShowAddModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error adding clinic:', error);
      alert(error.response?.data?.error || 'An error occurred while adding the clinic');
    }
  };

  const handleUpdateClinic = async () => {
    if (editClinic) {
      try {
        const response = await axios.put(`${API_BASE_URL}/${editClinic.id}`, editClinic, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClinics(clinics.map(clinic => clinic.id === response.data.id ? response.data : clinic));
        setEditClinic(null);
        setModalMessage('Clinic updated successfully!');
        setShowEditModal(false);
        setShowSuccessModal(true);
      } catch (error) {
        console.error('Error updating clinic:', error);
        alert(error.response?.data?.error || 'An error occurred while updating the clinic');
      }
    }
  };

  const handleDeleteClinic = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClinics(clinics.filter(clinic => clinic.id !== id));
      setModalMessage('Clinic deleted successfully!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error deleting clinic:', error);
      alert(error.response?.data?.error || 'An error occurred while deleting the clinic');
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Clinic Management</h1>

      <div className="mb-4">
        <Button onClick={() => setShowAddModal(true)} className="btn btn-primary">Add New Clinic</Button>
      </div>

      <h2 className="h4 mb-3">Clinic List</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Open Time</th>
              <th>Close Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clinics.map(clinic => (
              <tr key={clinic.id}>
                <td>{clinic.name}</td>
                <td>{clinic.address}</td>
                <td>{clinic.phoneNumber}</td>
                <td>{clinic.openTime}</td>
                <td>{clinic.closeTime}</td>
                <td>
                  <Button
                    onClick={() => {
                      setEditClinic({ ...clinic });
                      setShowEditModal(true);
                    }}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteClinic(clinic.id)}
                    className="btn btn-danger btn-sm me-2"
                  >
                    Delete
                  </Button>
                  <Link to={`/clinics/${clinic.id}`}>
                    <Button className="btn btn-info btn-sm">
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Clinic Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Clinic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newClinic.name}
                onChange={(e) => setNewClinic({ ...newClinic, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={newClinic.address}
                onChange={(e) => setNewClinic({ ...newClinic, address: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={newClinic.phoneNumber}
                onChange={(e) => setNewClinic({ ...newClinic, phoneNumber: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Open Time</Form.Label>
              <Form.Control
                type="time"
                value={newClinic.openTime}
                onChange={(e) => setNewClinic({ ...newClinic, openTime: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Close Time</Form.Label>
              <Form.Control
                type="time"
                value={newClinic.closeTime}
                onChange={(e) => setNewClinic({ ...newClinic, closeTime: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddClinic}>
              Add Clinic
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Clinic Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Clinic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editClinic?.name || ''}
                onChange={(e) => setEditClinic({ ...editClinic, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={editClinic?.address || ''}
                onChange={(e) => setEditClinic({ ...editClinic, address: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={editClinic?.phoneNumber || ''}
                onChange={(e) => setEditClinic({ ...editClinic, phoneNumber: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Open Time</Form.Label>
              <Form.Control
                type="time"
                value={editClinic?.openTime || ''}
                onChange={(e) => setEditClinic({ ...editClinic, openTime: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Close Time</Form.Label>
              <Form.Control
                type="time"
                value={editClinic?.closeTime || ''}
                onChange={(e) => setEditClinic({ ...editClinic, closeTime: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleUpdateClinic}>
              Update Clinic
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Body>
          <h5>{modalMessage}</h5>
          <Button onClick={() => setShowSuccessModal(false)}>Close</Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ClinicsManagement;
