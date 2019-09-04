import React from "react";

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
				<div className="logo">ZincBind</div>
				<div className="mobile-menu" onClick={this.toggleMenu}>
					<div><div></div><div></div><div></div></div>
				</div>
				<div className="nav-links">
					<a>Search</a>
					<a>Predict</a>
					<a>Data</a>
					<a>About</a>
					<a>Help</a>
				</div>
			</nav>
		);
	}
}

export default Nav;
