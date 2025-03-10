// src/pages/SkuPage.tsx
import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../store";
import { addSku, removeSku, updateSku } from "../store/skusSlice";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import "./SkuPage.css";

const SkuPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const skus = useAppSelector((state) => state.skus.data);

  // Local state for adding a new SKU
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCost, setNewCost] = useState("");

  // Inline edit states
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCost, setEditCost] = useState("");

  // Handle adding a new SKU
  const handleAddSku = () => {
    if (newName.trim()) {
      dispatch(
        addSku({
          name: newName,
          price: parseFloat(newPrice) || 0,
          cost: parseFloat(newCost) || 0
        })
      );
      // Reset fields
      setNewName("");
      setNewPrice("");
      setNewCost("");
    }
  };

  // Begin editing a row
  const handleEditClick = (
    skuId: string,
    currentName: string,
    currentPrice: number,
    currentCost: number
  ) => {
    setEditRowId(skuId);
    setEditName(currentName);
    setEditPrice(String(currentPrice));
    setEditCost(String(currentCost));
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditRowId(null);
  };

  // Save edited SKU
  const handleSaveEdit = (id: string) => {
    dispatch(
      updateSku({
        id,
        name: editName,
        price: parseFloat(editPrice) || 0,
        cost: parseFloat(editCost) || 0
      })
    );
    setEditRowId(null);
  };

  // Remove SKU
  const handleRemoveSku = (id: string) => {
    dispatch(removeSku(id));
  };

  return (
    <div className="sku-page">
      <h2 className="page-title">SKUs</h2>

      <table className="sku-table">
        <thead>
          <tr>
            <th>S. No</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Cost</th>
            <th className="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {skus.map((sku, index) => {
            const isEditing = editRowId === sku.id;
            return (
              <tr key={sku.id}>
                <td>{index + 1}</td>

                {/* Inline editing for SKU name */}
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    sku.name
                  )}
                </td>

                {/* Inline editing for Price */}
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                    />
                  ) : (
                    `$${sku.price.toFixed(2)}`
                  )}
                </td>

                {/* Inline editing for Cost */}
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editCost}
                      onChange={(e) => setEditCost(e.target.value)}
                    />
                  ) : (
                    `$${sku.cost.toFixed(2)}`
                  )}
                </td>

                {/* Action buttons (Edit/Delete or Save/Cancel) */}
                <td style={{ textAlign: "center" }}>
                  {isEditing ? (
                    <>
                      <FaCheck
                        className="icon-button save-icon"
                        title="Save"
                        onClick={() => handleSaveEdit(sku.id)}
                      />
                      <FaTimes
                        className="icon-button cancel-icon"
                        title="Cancel"
                        onClick={handleCancelEdit}
                      />
                    </>
                  ) : (
                    <>
                      <FaEdit
                        className="icon-button edit-icon"
                        title="Edit"
                        onClick={() =>
                          handleEditClick(sku.id, sku.name, sku.price, sku.cost)
                        }
                      />
                      <FaTrash
                        className="icon-button delete-icon"
                        title="Delete"
                        onClick={() => handleRemoveSku(sku.id)}
                      />
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Optional form to add new SKUs */}
      <div className="sku-form">
        <input
          placeholder="SKU Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          placeholder="Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />
        <input
          placeholder="Cost"
          value={newCost}
          onChange={(e) => setNewCost(e.target.value)}
        />
        <button onClick={handleAddSku} className="add-sku-button">
          Add SKU
        </button>
      </div>
    </div>
  );
};

export default SkuPage;
