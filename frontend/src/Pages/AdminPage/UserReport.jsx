import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

export default function UserReport() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("all");
    const componentRef = useRef();

    useEffect(() => {
        setLoading(true);
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3500/user/');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = filter === 'all' ? users : users.filter(user => user.role === filter);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div>
            <div style={{ marginBottom: '20px', marginLeft: '10%' }}>
                <label htmlFor="all" style={{ marginRight: '10px' }}>
                    <input
                        type="radio"
                        id="all"
                        name="filter"
                        value="all"
                        checked={filter === "all"}
                        onChange={handleFilterChange}
                        style={{ marginRight: '5px', marginTop: '100px', marginLeft: '190px'}}
                    />
                    All Users
                </label>
                <label htmlFor="user" style={{ marginRight: '10px' }}>
                    <input
                        type="radio"
                        id="user"
                        name="filter"
                        value="user"
                        checked={filter === "user"}
                        onChange={handleFilterChange}
                        style={{ marginRight: '5px' }}
                    />
                    Users
                </label>
            </div>

            <div ref={componentRef} className="SSR_details" style={{ marginTop: '20px' }}>
                <div className="SSR_supplier" style={{ padding: '20px', backgroundColor: '#1F1D2B', borderRadius: '10px', marginLeft: '190px', marginRight: '100px'}}>
                    <div className="SSR_cardHeader" style={{ marginBottom: '20px' }}>
                        <span className="SSR_cardName" style={{ background: '#1F1D2B', fontSize: '24px', fontWeight: 'bold' , color:"white"}}>User Report</span>
                    </div>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#1F1D2B', textAlign: 'left' }}>
                                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>No</td>
                                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>Name</td>
                                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>Email</td>
                                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>Role</td>
                                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>Gender</td>
                                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>Address</td>
                                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>Age</td>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <tr key={user._id}>
                                        <td style={{ padding: '8px', border: '1px solid #ccc' , color:"white" }}>{index + 1}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ccc', color:"white" }}>{user.name}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ccc', color:"white" }}>{user.email}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ccc', color:"white" }}>{user.role}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ccc', color:"white" }}>{user.gender}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ccc', color:"white" }}>{user.address}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ccc', color:"white" }}>{user.age}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <button
                onClick={handlePrint}
                className="SSR_print-button"
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginLeft: '20%',
                }}
            >
                Print PDF
            </button>
        </div>
    );
}
