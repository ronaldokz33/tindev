import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './main.css';
import api from '../services/api';

import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';

function Main({ match }){
    const [ users, setUsers ] = useState([]);

    useEffect(() => {
        const loadUsers = async () =>{
            const response = api.get(`devs`, {
                headers: {
                    user: match.params.id
                }
            });

            if(response.data != null && response.data !== undefined){
                setUsers(response.data);
            }
        }

        loadUsers();
    }, [match.params.id]);

    const handleLike = async (id) => {
        console.log(id);
        await api.post(`devs/${id}/likes`, null, {
            headers: { user: match.params.id }
        });

        setUsers(users.filter(user => user._id !== id));
    }

    const handleDislike = async (id) => {
        console.log(id);
        await api.post(`devs/${id}/dislikes`, null, {
            headers: { user: match.params.id }
        });

        setUsers(users.filter(user => user._id !== id));
    }

    return (
        <div className="main-container">
            <Link to="/">
                <img src={logo} alt="Tindev" />
            </Link>
            <ul>
                {
                    users.length > 0 ?
                        users.map(user => {
                            return (
                                <li key={user._id}>
                                    <img src={user.avatar} />
                                    <footer>
                                        <strong>{user.nome}</strong>
                                        <p>{user.bio}</p>
                                    </footer>
                                    <div className="buttons">
                                        <button onClick={() => handleDislike(user._id)} type="button">
                                            <img src={dislike} alt="dislike" />
                                        </button>
                                        <button onClick={() => handleLike(user._id)} type="button">
                                            <img src={like} alt="like" />
                                        </button>
                                    </div>
                                </li>
                            );
                        })
                        :
                        <div class="empty">Acabou :(</div>
                }

                <li>
                    <img src="http://www.wizards-of-os.org/uploads/pics/Rlemos.jpg" />
                    <footer>
                        <strong>Ronaldo lemos</strong>
                        <p>Uma beve descrição</p>
                    </footer>
                    <div className="buttons">
                        <button type="button">
                            <img src={dislike} alt="dislike" />
                        </button>
                        <button type="button">
                            <img src={like} alt="like" />
                        </button>
                    </div>
                </li>
                <li>
                    <img src="http://www.wizards-of-os.org/uploads/pics/Rlemos.jpg" />
                    <footer>
                        <strong>Ronaldo lemos</strong>
                        <p>Uma beve descrição</p>
                    </footer>
                    <div className="buttons">
                        <button type="button">
                            <img src={dislike} alt="dislike" />
                        </button>
                        <button type="button">
                            <img src={like} alt="like" />
                        </button>
                    </div>
                </li>
                <li>
                    <img src="http://www.wizards-of-os.org/uploads/pics/Rlemos.jpg" />
                    <footer>
                        <strong>Ronaldo lemos</strong>
                        <p>Uma beve descrição</p>
                    </footer>
                    <div className="buttons">
                        <button type="button">
                            <img src={dislike} alt="dislike" />
                        </button>
                        <button type="button">
                            <img src={like} alt="like" />
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    );
}

export default Main;