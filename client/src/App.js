import React, { useState } from "react";
import "./App.css";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Partners from "./pages/Partners";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import DocumentsNew from "./pages/DocumentsNew";
import Layout from "./components/Layout";
import Declaration from "./pages/Declaration";
import Search from "./pages/Search";

import DocumentDetail from "./pages/DocumentDetail";
import PreviewOther from "./components/Documents/PreviewOther";
import Unauthorized from "./pages/Unauthorized";
import Login from "./pages/Login";

// Zoll Pages
import ZollTransactions from "./pages/Zoll/ZollTransactions";
import ZollDocuments from "./pages/Zoll/ZollDocuments";
import ZollLayout from "./components/ZollLayout";

import RequireAuth from "./components/requireAuth";
import PersistLogin from "./components/PersistLogin";

import { Routes, Route } from "react-router-dom";
import PreviewDelacration from "./components/Documents/PreviewDeclaration";

import useAuth from "./hooks/useAuth";

function App() {
  const { auth } = useAuth();
  return (
    <Routes>
      {/*public routes*/}

      {/* Layout Komponente ist gerade ein Outlet (alles andere erbt davon für alles), ich würde vorschlagen zwei Anzulegen einmal für zoll und normale Mitarbeiter. Das können wir auch nach Farben utnescheiden*/}
      <Route path="login" element={<Login />} />

      {/*allgemeine Klasse für persistent Login*/}
      <Route element={<PersistLogin />}>
        <Route
          path="/"
          element={
            auth.role == "company_employee" ? <Layout /> : <ZollLayout />
          }
        >
          <Route
            element={
              <RequireAuth
                allowedRoles={["company_employee", "custom_officer"]}
              />
            }
          >
            <Route
              path="/"
              element={
                auth.role == "company_employee" ? (
                  <Dashboard />
                ) : (
                  <ZollTransactions />
                )
              }
            />
          </Route>

          {/* private for company */}
          <Route element={<RequireAuth allowedRoles={["company_employee"]} />}>
            <Route path="search" element={<Search />} />

            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" key={3} element={<Transactions />} />
            <Route path="partners" element={<Partners />} />
            <Route path="/partners/:partnershipID" element={<Transactions />} />
            <Route path="settings" element={<Settings />} />
            <Route
              path="/transactions/:transactionId"
              element={<DocumentsNew />}
            ></Route>
            <Route
              path="/transactions/:transactionId/declarationView"
              element={<PreviewDelacration />}
            />
            <Route
              path="/transactions/:transactionId/declaration"
              element={<Declaration />}
            />
            <Route
              path="/transactions/:transactionId/document/:documentID"
              element={<DocumentDetail />}
            />
          </Route>
          {/*private routes für den zoll*/}
          <Route element={<RequireAuth allowedRoles={["custom_officer"]} />}>
            <Route
              path="zoll/declarations/:declarationID"
              element={<ZollDocuments />}
            />
            <Route path="zoll/declarations" element={<ZollTransactions />} />
            <Route
              path="zoll/declarations/:declarationID/declarationView"
              element={<PreviewDelacration />}
            />
            <Route
              path="zoll/declarations/:declarationID/document/:documentID"
              element={<DocumentDetail />}
            />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}

export default App;
