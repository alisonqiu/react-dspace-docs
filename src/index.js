import React from 'react';
import ReactDOM from 'react-dom/client';
import {QueryClient, QueryClientProvider} from "react-query";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import DocumentsApp from "./Component/Documents/DocumentsApp";
import { ThemeProvider } from '@mui/material/styles';
import {theme} from "./Theme";

const queryClient = new QueryClient()
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DocumentsApp/>}/>
            {/* <Route path="voyage" element={<VoyageApp/>}/>
            <Route path="voyage/:id" element={<VoyageApp/>}/>
            <Route path="home2" element={<Home2/>}/>
            <Route path="past" element={<PASTApp/>}/>
            <Route path="/geo/routes" element={<>
              <div><Map/>
              </div>
              <div>
              </div></>}/> */}
            {/* <Route path="documents" element={<DocumentsApp/>}/>
            <Route path="optionSelector" element={<OptionSelector/>}/> */}
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

