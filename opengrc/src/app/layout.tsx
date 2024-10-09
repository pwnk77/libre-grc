import { DevtoolsProvider } from "@providers/devtools";
import { Sider, useNotificationProvider } from "@refinedev/antd";
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
import { AuditOutlined, ControlOutlined, LogoutOutlined, BookOutlined, FileTextOutlined, ExperimentOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
  title: "open-grc",
  description: "open source grc application",
  icons: {
    icon: "/favicon.ico",
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
                        name: "controls",
                        list: "/controls",
                        create: "/controls/create",
                        edit: "/controls/edit/:id",
                        show: "/controls/show/:id",
                        meta: {
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
                          canDelete: true,
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
                          canDelete: true,
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
                          canDelete: true,
                          icon: <FileTextOutlined />,
                        },
                      },
                      {
                        name: "testing",
                        list: "/testing",
                        create: "/testing/create",
                        edit: "/testing/edit/:id",
                        show: "/testing/show/:id",
                        meta: {
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
                      title: { text: "open-grc", icon: <AppIcon /> },
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
