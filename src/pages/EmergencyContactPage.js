// src/pages/EmergencyContactsPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./emgPage.css"
import API from '../API';
import { useSelector } from 'react-redux';
import AddEditContactModal from './AddEditContactModal';
import Navbar from '../components/navBar';
import Footer from '../components/footer';

function EmergencyContactsPage() {
    const { token } = useSelector((state) => state.userData);
    const [contacts, setContacts] = useState([]);
    const [editingContact, setEditingContact] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchContacts = async () => {
        try {
            console.log("token", token)
            const res = await axios.get(API.FETCH_EMERGENCY_CONTACT_BY_ID, {
                headers: { Authorization: token },
            });
            setContacts(res.data.contacts);
        } catch (err) {
            console.error("Error fetching contacts", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this contact?")) return;
        try {
            await axios.delete(`${API.DELETE_EMERGENCY_CONTACT}/${id}`, {
                headers: { Authorization: token },
            });
            fetchContacts();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return <>
        <div className='page-wrapper' style={{marginTop :"100px"}}>
            <Navbar />
            <div className="container s" >
                <h4>Emergency Contacts</h4>
                <button className="btn btn-primary mb-3" onClick={() => {
                    setEditingContact(null);
                    setShowModal(true);
                }}>
                    ➕ Add Contact
                </button>

                <table className="table table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th style={{ width: "150px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map(c => (
                            <tr key={c._id}>
                                <td>{c.name}</td>
                                <td>{c.contactNumber}</td>
                                <td>{c.email}</td>
                                <td>
                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => {
                                         setEditingContact({ ...c, emgId: c._id });;
                                        setShowModal(true);
                                    }}>Edit</button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {showModal && (
                    <AddEditContactModal
                        show={showModal}
                        onClose={() => setShowModal(false)}
                        onSave={fetchContacts}
                        contact={editingContact}
                    />
                )}
            </div>
            <Footer />
        </div>
    </>
}

export default EmergencyContactsPage;
