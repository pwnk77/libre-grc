import { DevtoolsProvider } from "@providers/devtools";
import { useNotificationProvider } from "@refinedev/antd";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React, { Suspense } from "react";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AppIcon } from "@components/app-icon";
import { ColorModeContextProvider } from "@contexts/color-mode";
import { authProviderClient } from "@providers/auth-provider";
import { dataProvider } from "@providers/data-provider";
import "@refinedev/antd/dist/reset.css";
import { AuditOutlined, ControlOutlined, LogoutOutlined, BookOutlined, FileTextOutlined, ExperimentOutlined, AlertOutlined, SafetyOutlined, FileProtectOutlined, DashboardOutlined, HomeOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
  title: "libre-grc",
  description: "open source grc application",
  icons: {
    icon: "/libre-grc-icon.ico", // Make sure to add this icon file to your public folder
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");
  const defaultMode = theme?.value === "dark" ? "dark" : "light";

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Suspense>
          <RefineKbarProvider>
            <AntdRegistry>
              <ColorModeContextProvider defaultMode={defaultMode}>
                <DevtoolsProvider>
                  <Refine
                    routerProvider={routerProvider}
                    authProvider={authProviderClient}
                    dataProvider={dataProvider}
                    notificationProvider={useNotificationProvider}
                    resources={[
                      {
                        name: "home",
                        list: "/home",
                        meta: {
                          label: "Home",
                          icon: <HomeOutlined />,
                        },
                      },
                      {
                        name: "governance",
                        meta: {
                          label: "Governance",
                          icon: <DashboardOutlined />,
                        },
                      },
                      {
                        name: "dashboards",
                        list: "/dashboards",
                        show: "/dashboards/blank",
                        meta: {
                          parent: "governance",
                          canDelete: false,
                          icon: <DashboardOutlined />,
                        },
                      },
                      {
                        name: "policies",
                        list: "/policies",
                        create: "/policies/create",
                        edit: "/policies/edit/:id",
                        show: "/policies/show/:id",
                        meta: {
                          parent: "governance",
                          canDelete: true,
                          label: "Policies",
                          icon: <FileProtectOutlined />,
                        },
                      },
                      {
                        name: "risk",
                        meta: {
                          label: "Risk",
                          icon: <AlertOutlined />,
                        },
                      },
                      {
                        name: "risks",
                        list: "/risks",
                        create: "/risks/create",
                        edit: "/risks/edit/:id",
                        show: "/risks/show/:id",
                        meta: {
                          parent: "risk",
                          canDelete: true,
                          label: "Risks",
                          icon: <AlertOutlined />,
                        },
                      },
                      {
                        name: "secure_by_design",
                        list: "/secure_by_design",
                        create: "/secure_by_design/create",
                        edit: "/secure_by_design/edit/:id",
                        show: "/secure_by_design/show/:id",
                        meta: {
                          parent: "risk",
                          canDelete: true,
                          label: "Secure by Design",
                          icon: <SafetyOutlined />,
                        },
                      },
                      {
                        name: "compliance",
                        meta: {
                          label: "Compliance",
                          icon: <AuditOutlined />,
                        },
                      },
                      {
                        name: "authority_documents",
                        list: "/authority_documents",
                        create: "/authority_documents/create",
                        edit: "/authority_documents/edit/:id",
                        show: "/authority_documents/show/:id",
                        meta: {
                          parent: "compliance",
                          canDelete: true,
                          label: "Authority Sources",
                          icon: <BookOutlined />,
                        },
                      },
                      {
                        name: "citations",
                        list: "/citations",
                        create: "/citations/create",
                        edit: "/citations/edit/:id",
                        show: "/citations/show/:id",
                        meta: {
                          parent: "compliance",
                          canDelete: true,
                          icon: <FileTextOutlined />,
                        },
                      },
                      {
                        name: "controls",
                        list: "/controls",
                        create: "/controls/create",
                        edit: "/controls/edit/:id",
                        show: "/controls/show/:id",
                        meta: {
                          parent: "compliance",
                          canDelete: true,
                          icon: <ControlOutlined />,
                        },
                      },
                      {
                        name: "audits",
                        list: "/audits",
                        create: "/audits/create",
                        edit: "/audits/edit/:id",
                        show: "/audits/show/:id",
                        meta: {
                          parent: "compliance",
                          canDelete: true,
                          icon: <AuditOutlined />,
                        },
                      },
                      {
                        name: "testing",
                        list: "/testing",
                        create: "/testing/create",
                        edit: "/testing/edit/:id",
                        show: "/testing/show/:id",
                        meta: {
                          parent: "compliance",
                          canDelete: true,
                          label: "Testing",
                          icon: <ExperimentOutlined />,
                        },
                      },
                    ]}
                    options={{
                      syncWithLocation: true,
                      warnWhenUnsavedChanges: true,
                      useNewQueryKeys: false,
                      projectId: "G9nsCS-VM02FI-KfqRO9",
                      title: { text: "libre-grc", icon: <AppIcon /> },
                    }}
                  >
                    {children}
                    <RefineKbar />
                  </Refine>
                </DevtoolsProvider>
              </ColorModeContextProvider>
            </AntdRegistry>
          </RefineKbarProvider>
        </Suspense>
      </body>
    </html>
  );
}
