import React from 'react';

const MainLayout = props =>{

    return (
        <div className="fullHeight">
            <div className="main">
                {props.children}
            </div>

        </div>

    );

};

export default MainLayout;