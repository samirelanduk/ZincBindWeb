import React, { Component } from "react";
import { Link } from "react-router-dom";
import Box from "./Box";

class Help extends Component {
    
    render() {
        document.title = "Help - ZincBind";
        
        return (
            <main className="help">
                <Box>
                    <h1>Help</h1>
                </Box>

                <Box>
                    <h2>There's a particular zinc binding site I want to examine.</h2>
                    <p>If you know the PDB code of the structure containing your zinc
                    binding site, you can access it by entering the PDB code into the search
                    bar on the <Link to="/">main page</Link>. This should return the PDB, and
                    all of the zinc sites it contains.</p>
                    <p>You can click the PDB to go to the page for that PDB and view all of
                    its contents, or if you see the specific site you are looking for in
                    the search results, you can click that to go directly to it.</p>
                </Box>

                <Box>
                    <h2>I don't have a particular binding site in mind, but I am looking for
                    a particular <em>kind</em> of binding site.</h2>
                    <p>The <Link to="/search/">advanced search page</Link> allows you to query
                    the data by some particular parameter. For example, you could look at
                    only those structures with a <Link to="/search?resolution_lt=1.5">
                    resolution better than 1.5 Angstroms</Link>, or those
                    which <Link to="/search?keywords=zinc+finger">describe themselves as a zinc
                    finger</Link>,
                    or <Link to="/search?technique=NMR&deposited_gt=2015-01-01&organism=saccharomyces">
                    NMR structures published since 2015 from yeast</Link>.</p>
                </Box>
                
                <Box>
                    <h2>I have a protein and I want to know if it encodes a protein
                    which binds zinc.</h2>
                    <p>If you have the sequence, you might first want to try performing
                    a BLAST search at the bottom of
                    ZincBind's <Link to="/search/">search page</Link>. This will
                    tell you how similar your sequence is to sequences known to
                    bind zinc, and results are returned 'best match first'.</p>
                    <p>You can also search your protein using ZincBind's predictive
                    models <Link to="/predict/">here</Link>. You can pass a
                    structure or a sequence, and the protein will be analysed
                    using machine learning classifiers to identify possible
                    zinc binding sites.</p>
                </Box>

                <Box>
                    <h2>I'm a developer and I want to access the data with a script or
                    other program.</h2>
                    <p>The GraphQL API can be found <Link to="/api/">here</Link>. You can also
                    download the database from the <Link to="/data/">data page</Link>.</p>
                </Box>

                <Box>
                    <h2>I don't have a particular goal in mind, I just want to see what kind
                    of data is here.</h2>
                    <p>The full list of binding sites can be browsed <Link to="/data/all/">
                    here</Link>.</p>
                    <p>In addition, you can browse by family <Link to="/families">here</Link>. In
                    ZincBind, a family is a collection of binding sites that each share the
                    same residue identities. So, the 'H3' family contains all those which
                    contain three histidine residues, 'C2H2' contains all those with two
                    cysteine and two histidine residues, and so on.</p>
                </Box>

                <Box>
                    <h2>I'm on the page for a PDB and I don't know what I'm looking at.</h2>
                    <p>At the top of the page is the PDB's title - this is how the structure
                    as a whole is described in the .pdb file. It may or may not mention
                    zinc - a structure's zinc binding sites are not always the most
                    important feature after all.</p>
                    <p>Next comes a table of descriptive properties of the PDB - when it was
                    deposited to the Data Bank, how its structure is classified, etc. These
                    are parsed automatically from the .pdb file.</p>
                    <p>After this is a description of the 'zinc bearing chains' in the PDB -
                    these are those chains with residues involved in zinc binding in some
                    way - and the relevant metal ions it contains. Here 'relevant' means
                    zinc, and any other metal that is in a zinc binding site. Within the
                    chain sequence, binding residues will be capitalised and in bold.</p>
                    <p>Any zinc atoms in the PDB which have not been assigned a binding site
                    will also be listed, along with the reason for their exclusion.</p>
                    <p>Then there is a list of all the zinc binding sites in that PDB. Each
                    one is a clickable link to that site's page, and has a summary of the
                    residues in that site.</p>
                    <p>Finally there is a 3D manipulatable view of the whole PDB structure,
                    with all the zinc binding sites visible. You can manipulate this with
                    your mouse/touch gestures, and use the controls that accompany it.</p>
                </Box>

                <Box>
                    <h2>I'm on the page for a Zinc Site and I don't know what I'm looking
                    at.</h2>
                    <p>At the top of the page is the Zinc Site's unique ID - this is
                    generally the PDB code that contains it followed by the zinc site number
                    within that protein.</p>
                    <p>After this is a quick summary of the binding site - the title of the
                    PDB it comes from, and the IDs of the metals and residues it contains.
                    You can click on any of these boxes, and the relevant atoms will light
                    up in green in the 3D display below.</p>
                    <p>Next comes links to any 'equivalent' binding sites. Many proteins
                    are duplicated in the PDB, or exist in mutated forms, so many zinc
                    binding sites will be duplicates. These are clustered together in
                    ZincBind by first clustering all chains into clusters on 90% sequence
                    identity, and then assigning sites to clusters where all sites in that
                    cluster are associated with the same chain cluster(s), and have the
                    same residue IDs. Clicking any of these links will take you to a page
                    for a zinc site which looks very similar.</p>
                    <p>Below this is the 3D manipulatable view of the site, zoomed in to the
                    relevant residues. You can manipulate this with your mouse/touch
                    gestures, and use the controls that accompany it.</p>
                    <p>Then there is a list of chains associated with the binding site.
                    Binding residues are highlighted here, but only if they are binding in
                    this particular site.</p>
                    <p>Finally there is a summary of the other relevant PDB information for
                    the structure the site comes from.</p>
                </Box>

                <Box>
                    <h2>I'm on the page for a Zinc Site Group and I don't know what I'm looking
                    at.</h2>
                    <p>The group's family will be listed first, along with classifications
                    and keywords that appear often in the binding sites within this group.
                    These can often give an insight as to the common function of the sites
                    in the group, but do remember that they are automatically generated.</p>
                    <p>After this comes a list of binding sites in this group.</p>
                </Box>
            </main>
        );
    }
}
 
export default Help;