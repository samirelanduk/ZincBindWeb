import React from "react";
import { Link } from "react-router-dom";

class Nav extends React.Component {

	toggleMenu = (e) => {
		let navLinks = document.getElementsByClassName("nav-links")[0];
		
		if (navLinks.style.height) {
			navLinks.style.removeProperty("height");
			navLinks.removeAttribute("style");
		} else {
			let height = 0;
			let links = navLinks.getElementsByTagName("a");
			for (var i = 0; i < links.length; i++) {
				height += links.item(i).clientHeight;
			}
			navLinks.style = "height: " + height + "px";
		}
	}
	render() {
		return (
			<nav>
				<Link className="logo" to="/">ZincBind</Link>
				<div className="mobile-menu" onClick={this.toggleMenu}>
					<div><div></div><div></div><div></div></div>
				</div>
				<div className="nav-links">
					<Link to="/search/">Search</Link>
					<Link to="/predict/">Predict</Link>
					<Link to="/data/">Data</Link>
					<Link to="/about/">About</Link>
					<Link to="/help/">Help</Link>
				</div>
			</nav>
		);
	}
}

export default Nav;
