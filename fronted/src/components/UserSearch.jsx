import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import DotLoader from "react-spinners/DotLoader";

const UserSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            if (query.trim()) {
                try {
                    setLoading(true);
                    const res = await axios.get(`https://dilltalks.onrender.com/api/v1/user/users/search`, {
                        params: { q: query },
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    });
                    setResults(res.data.users);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchUsers();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <div className="px-4 py-9 ml-[16%] lg:p-8">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users..."
                className="p-2 border rounded-md w-full mb-4"
            />
            <div>
                {loading ? (
                    <div className="flex justify-center items-center h-64 ">
                        <DotLoader
                            color={"#000"}
                            loading={loading}
                            size={100}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                ) : (
                    results.length > 0 ? (
                        results.map((user) => (
                            <Link to={`/profile/${user?._id}`} key={user._id}>
                                <div className="p-2 border-b flex items-center gap-3 cursor-pointer">
                                    <Avatar>
                                        <AvatarImage src={user?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <p className="font-bold">{user?.username}</p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p>No users found.</p>
                    )
                )}
            </div>
        </div>
    );
};

export default UserSearch;
