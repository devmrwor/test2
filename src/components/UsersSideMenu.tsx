import React, { useState } from "react";
import { AccordionDetails, List, ListItemText, ListItemButton } from "@mui/material";
import { useTranslation } from "next-i18next";
import { Routes, UserSubRoutes } from "../../common/enums/api-routes";
import { uniteRoutes } from "@/utils/uniteRoute";
import { useRouter } from "next/router";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { useUsersContext } from "@/contexts/usersContext";
import classNames from "classnames";
import ListItem from "./menu/common/ListItem";
import Link from "next/link";

export default function SideMenu() {
  const { t } = useTranslation();

  const router = useRouter();
  const { userRole, userId } = router.query;
  const { username, user } = useUsersContext();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [openNestedRoute, setOpenNestedRoute] = useState("profiles");

  const menuItems = [
    {
      label: t("main"),
      subRoute: UserSubRoutes.MAIN,
    },

    {
      label: t("profiles"),
      subRoute: UserSubRoutes.PROFILES,
      nestedItems: user
        ? user.profiles
            .filter((profile) => !profile.is_main)
            .map((item) => ({
              label: item?.category?.name || item?.name,
              // label: item?.name,
              link: uniteRoutes([
                Routes.USERS,
                userRole as string,
                userId as string,
                UserSubRoutes.PROFILES,
                item.id,
              ]),
            }))
        : [],
      listName: "profiles",
    },

    {
      label: t("rating"),
      subRoute: UserSubRoutes.RATING,
    },

    {
      label: t("details"),
      subRoute: UserSubRoutes.DETAILS,
    },

    {
      label: t("feedbacks"),
      subRoute: UserSubRoutes.FEEDBACKS,
    },

    {
      label: t("orders"),
      subRoute: UserSubRoutes.ORDERS,
    },

    {
      label: t("messengers"),
      subRoute: UserSubRoutes.MESSENGERS,
    },

    {
      label: t("profile_settings"),
      subRoute: UserSubRoutes.SETTINGS,
    },
  ];

  return (
    <div className="flex flex-col w-menu mt-0.75">
      <h2 className="text-2xl font-bold mb-6">{username}</h2>
      <div
        className={classNames(
          "w-full h-fit max-w-menu mb-4 border-secondary border-2 rounded-small",
          isMenuOpen && "pb-6"
        )}
      >
        <div className="flex justify-between items-center bg-secondary w-full py-3.5 pb-3.25 px-4 mb-2 rounded">
          <h2 className="text-text-secondary">{t("profile")}</h2>
          <button type="button" onClick={() => setIsMenuOpen((prev) => !prev)}>
            <ExpandMoreIcon className={classNames(isMenuOpen && "rotate-180")} color="secondary" />
          </button>
        </div>
        {isMenuOpen && (
          <div>
            {menuItems.map((item) =>
              item.nestedItems ? (
                <div key={item.label}>
                  <div
                    onClick={() =>
                      setOpenNestedRoute((prev) => (prev === item.listName ? "" : item.listName))
                    }
                    className="flex justify-between items-center w-nested-menu mx-auto px-2 py-2 cursor-pointer text-text-secondary hover:text-primary-100 hover:fill-primary-100 hover:bg-background transition-all"
                  >
                    <div className="flex gap-2 items-center">
                      <Link
                        href={uniteRoutes([
                          Routes.USERS,
                          userRole as string,
                          userId as string,
                          item.subRoute,
                        ])}
                      >
                        <h2
                          className={classNames(
                            "text-base text-inherit",
                            router.asPath.includes(item.subRoute as string) && "text-primary-100"
                          )}
                        >
                          {item.label}
                        </h2>
                      </Link>
                    </div>

                    <button type="button">
                      <ExpandMoreIcon
                        className={classNames(openNestedRoute === item.listName && "rotate-180")}
                        color="secondary"
                      />
                    </button>
                  </div>
                  {openNestedRoute === item.listName && (
                    <div className="w-nested-menu mx-auto mb-1">
                      {item.nestedItems.map((nestedItem) => (
                        <ListItem
                          key={nestedItem.link}
                          link={nestedItem.link}
                          label={nestedItem.label}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <ListItem
                  key={item.label}
                  link={uniteRoutes([
                    Routes.USERS,
                    userRole as string,
                    userId as string,
                    item.subRoute,
                  ])}
                  label={item.label}
                />
              )
            )}
          </div>
        )}
        {/* {(isMenuOpen || "") &&
          menuItems.map((item) => (
            <ListItem
              key={item.label}
              link={uniteRoutes([
                Routes.USERS,
                userRole as string,
                userId as string,
                item.subRoute,
              ])}
              label={item.label}
            />
          ))} */}
      </div>
    </div>
  );
}
