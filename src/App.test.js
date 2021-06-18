import React from 'react';
import App from "./App";
import renderer from 'react-test-renderer';

test('component renders', () => {
    renderer.create(<App/>).getInstance();
})