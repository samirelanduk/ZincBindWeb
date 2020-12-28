import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Nav = () => {

	const navlinksRef = useRef(null);

	useEffect(() => {
		document.body.onresize = () => {
			if (navlinksRef.current.style.height.length) {
				vanquishNav()
			}
		}
	})

	const vanquishNav = () => {
		navlinksRef.current.style.transitionDuration = null;
		navlinksRef.current.style.height = null;
	}

	const toggleMenu = () => {
		let navLinks = navlinksRef.current;
		
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

	return (
		<nav>
			<Link className="logo" to="/">ZincBind</Link>
			<div className="mobile-menu" onClick={toggleMenu}>
				<div><div></div><div></div><div></div></div>
			</div>
			<div className="nav-links" ref={navlinksRef} onClick={vanquishNav}>
				<Link to="/search/">Search</Link>
				<Link to="/predict/">Predict</Link>
				<Link to="/data/">Data</Link>
				<Link to="/about/">About</Link>
				<Link to="/help/">Help</Link>
			</div>
		</nav>
	);
}

export default Nav;
