import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setLoading(true);
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3500/user/');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        try {
            const response = await fetch(`http://localhost:3500/user/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // If deletion is successful, fetch users again to update the list
                fetchUsers();
            } else {
                console.error('Error deleting user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <div style={{ backgroundColor: '#393C49', width: '260px', borderRadius: '10px', height: '2.5rem', marginLeft: '950px', padding: '0 20px', marginTop: '90px', display: 'inline-block', textAlign: 'center', verticalAlign: 'middle' }}>
                <FaSearch id="S_search-icon" style={{ color: 'white', marginBottom: '-3px', marginRight: '2px' }} />
                <input
                    className="S_search-text"
                    type="search"
                    placeholder="Search by name or role..."
                    name="searchQuery"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ backgroundColor: 'transparent', border: 'none', height: '2.5rem', marginLeft: '12px', fontSize: '15px', color: 'white', outline: 'none' }}
                />
            </div>

            <div className="ST_details" style={{ position: 'relative', width: '100%', display: 'grid', gridTemplateColumns: '2fr 1fr', gridGap: '30px', marginLeft: '200px', marginRight: '100px', padding: '100px 20px' }}>
                <div className="ST_supplier" style={{ position: 'relative', display: 'grid', minHeight: '250px', background: '#1F1D2B', padding: '20px', boxShadow: '0 7px 25px rgba(0, 0, 0, 0.08)', borderRadius: '20px', color: 'white' }}>
                    <div className="ST_cardHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span className="ST_cardName" style={{ fontWeight: '600', color: 'white', fontSize: '30px' }}>User List</span>
                        <Link to ="/userReport" className="S_cardbtn" style={{background: '#EA7C69', textDecoration: 'none', color: 'white', padding: '5px 10px', borderRadius: '6px'}}>User Report</Link>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ color: 'white', borderBottom: '1px solid #EA7C69' }}>
                                <td>No</td>
                                <td>Name</td>
                                <td>Email</td>
                                <td>Role</td>
                                <td>Gender</td>
                                <td>Address</td>
                                <td>Age</td>
                                <td>Action</td>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8">Loading...</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <tr key={user._id}>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{user.gender}</td>
                                        <td>{user.address}</td>
                                        <td>{user.age}</td>
                                        <td>
                                            <Link to={`/edit/${user._id}`}><AiFillEdit id="ST_update-icon" style={{ color: '#1F1D2B', marginRight: '10px', fontSize:'20px' }} /></Link>
                                            <botton onClick={() => deleteUser(user._id)}><AiFillDelete id ="S_delete-icon"style={{ fontSize:'20px' }} /></botton>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
