import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query'; // Import QueryClient and QueryClientProvider
import Home from './Pages/Home';
import Login from './Pages/Login';
import Forgotpassword from './Pages/Forgotpassword';
import VerificationForm from './Pages/VerificationForm';
import Signup from './Pages/Signup';
import Subscription from './Pages/Subscription';
import Activation from './Pages/Activation';
import Subscriptionpurchase from './Pages/Subscriptionpurchase';
import Info from './Pages/Info';
import Setupemail from './Pages/Setupemail';
import Success from './Pages/Success';
import Dashboard from './Pages/Dashboard';
import Dashboardhome from './Pages/Dashboardhome';
import Inbox from './Pages/Inbox';
import Sent from './Pages/Sent';
import Drafts from './Pages/Drafts';
import Templates from './Pages/Templates';
import Setting from './Pages/Setting';
import Profile from './Pages/Profile';
import ComposeEmail from './Components/ComposeEmail';

const queryClient = new QueryClient(); // Create a QueryClient instance

function App() {
  return (
    <QueryClientProvider client={queryClient}> {/* Wrap your app with QueryClientProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<Forgotpassword />} />
          <Route path="/verify" element={<VerificationForm />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/activation" element={<Activation />} />
          <Route path="/subscriptionpurchase" element={<Subscriptionpurchase />} />
          <Route path="/info" element={<Info />} />
          <Route path="/setupemail" element={<Setupemail />} />
          <Route path="/success" element={<Success />} />
          <Route path="/compose" element={<ComposeEmail />} />

          <Route path="/dashboard" element={<Dashboard />}>

          <Route index element={<Dashboardhome/>}/>
          <Route path='/dashboard/inbox' element={<Inbox/>}/>
          <Route path='/dashboard/sent' element={<Sent/>}/>
          <Route path='/dashboard/drafts' element={<Drafts/>}/>
          <Route path='/dashboard/templates' element={<Templates/>}/>
          <Route path='/dashboard/setting' element={<Setting/>}/>
          <Route path='/dashboard/profile' element={<Profile/>}/>
          
          </Route>

        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;





