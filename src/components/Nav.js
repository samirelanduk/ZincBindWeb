import React from "react";
import { Link } from "react-router-dom";

class Nav extends React.Component {

	componentDidMount() {
		document.body.onresize = () => {
			if (this.refs.navLinks.style.height.length) {
				this.vanquishNav()
			}
		}
	}

	vanquishNav = () => {
		this.refs.navLinks.style.transitionDuration = null;
		this.refs.navLinks.style.height = null;
	}

	toggleMenu = () => {
		let navLinks = this.refs.navLinks;
		
		if (navLinks.style.height) {
			navLinks.style.height = null;
			setTimeout(() => {
				navLinks.style.transitionDuration = null
			}, 250);
		} else {
			let height = 0;
			let links = navLinks.getElementsByTagName("a");
			for (var i = 0; i < links.length; i++) {
				height += links.item(i).clientHeight + 2;
			}
			height -= 2;
			navLinks.style.transitionDuration = "0.2s";
			navLinks.style.height = height + "px";
		}
	}

	render() {
		return (
			<nav>
				<Link className="logo" to="/">ZincBind</Link>
				<div className="mobile-menu" onClick={this.toggleMenu}>
					<div><div></div><div></div><div></div></div>
				</div>
				<div className="nav-links" ref="navLinks" onClick={this.vanquishNav}>
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
