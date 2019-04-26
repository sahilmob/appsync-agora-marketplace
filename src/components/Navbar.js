import { Button, Icon, Menu as Nav } from "element-react";

import { NavLink } from "react-router-dom";
import React from "react";

const Navbar = ({ user, handleSignOut }) => (
	<Nav mode="horizontal" theme="dark" defaultActive="1">
		<div className="nav-container">
			<Nav.Item index="1">
				<NavLink to="/" className="nav-link">
					<span className="app-title">
						<img
							src="https://icon.now.sh/account_balance/f90"
							alt="logo"
							className="app-icon"
						/>
						AmplifyAgora
					</span>
				</NavLink>
			</Nav.Item>
			<div className="nav-items">
				<Nav.Item index="2">
					<span className="app-user">Hello, {user.username}</span>
				</Nav.Item>
				<Nav.Item index="3">
					<NavLink to="profile" className="nav-link">
						<Icon name="setting" /> Profile
					</NavLink>
				</Nav.Item>
				<Nav.Item index="4">
					<Button type="warning" onClick={handleSignOut}>
						Sign Out
					</Button>
				</Nav.Item>
			</div>
		</div>
	</Nav>
);

export default Navbar;
