/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { faLongArrowLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CS_Item } from "@ianlucas/cslib";
import { MetaFunction } from "@remix-run/node";
import { Link, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { CSItemEditor, CSItemEditorAttributes } from "~/components/cs-item-editor";
import CSItemPicker from "~/components/cs-item-picker";
import { Modal } from "~/components/modal";
import { useRootContext } from "~/components/root-context";
import { useLockScroll } from "~/hooks/use-lock-scroll";
import { sync } from "~/utils/sync";
import { ApiActionInventoryAddUrl } from "./api.action.inventory-add._index";

export const meta: MetaFunction = () => {
  return [
    { title: "Craft - CS2 Inventory Simulator" }
  ];
};

export default function Craft() {
  const navigate = useNavigate();
  const [csItem, setCSItem] = useState<CS_Item>();
  const { setInventory } = useRootContext();

  useLockScroll();

  function handleSubmit(attributes: CSItemEditorAttributes) {
    if (csItem !== undefined) {
      const item = {
        id: csItem.id,
        ...attributes
      };
      setInventory(inventory => inventory.add(item));
      sync(ApiActionInventoryAddUrl, { item });
      return navigate("/");
    }
  }

  return (
    <Modal className="w-[540px]">
      <div className="font-bold px-4 py-2 select-none flex items-center justify-between text-sm">
        <span className="text-neutral-400">
          {csItem === undefined ? "Crafting an item..." : "Confirm craft"}
        </span>
        <div className="flex items-center gap-8">
          {csItem !== undefined && (
            <button
              className="flex items-center gap-1 text-neutral-200 cursor-default hover:bg-black/30 px-2 rounded font-normal"
              onClick={() => setCSItem(undefined)}
            >
              <FontAwesomeIcon icon={faLongArrowLeft} className="h-4" />
              Reset
            </button>
          )}
          <Link to="/">
            <FontAwesomeIcon
              icon={faXmark}
              className="h-4 opacity-50 hover:opacity-100"
            />
          </Link>
        </div>
      </div>
      {csItem === undefined
        ? <CSItemPicker onPickItem={setCSItem} />
        : <CSItemEditor csItem={csItem} onSubmit={handleSubmit} />}
    </Modal>
  );
}
