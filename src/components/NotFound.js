import React, { Component } from "react";
import Box from "./Box";

class NotFound extends Component {
    
    render() { 

        return (
            <main className="not-found">
                <Box>
                    <h1>Page Not Found</h1>
                </Box>
            </main>
        );
    }
}
 
export default NotFound;