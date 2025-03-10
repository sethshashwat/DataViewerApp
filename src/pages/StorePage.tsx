// src/pages/StorePage.tsx
import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../store";
import {
  addStore,
  removeStore,
  updateStore,
  reorderStore,
} from "../store/storesSlice";
import {
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import "./StorePage.css";
import DataImporter from "../components/DataImporter";

const StorePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const stores = useAppSelector((state) => state.stores.data);

  // For adding a new store
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [storeState, setStoreState] = useState("");

  // For inline editing
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editStoreState, setEditStoreState] = useState("");

  const handleAddStore = () => {
    if (name.trim() && city.trim() && storeState.trim()) {
      dispatch(addStore({ name, city, state: storeState }));
      setName("");
      setCity("");
      setStoreState("");
    }
  };

  // Edit store
  const handleEditClick = (
    storeId: string,
    currentName: string,
    currentCity: string,
    currentState: string
  ) => {
    setEditRowId(storeId);
    setEditName(currentName);
    setEditCity(currentCity);
    setEditStoreState(currentState);
  };

  const handleCancelEdit = () => {
    setEditRowId(null);
  };

  const handleSaveEdit = (id: string) => {
    dispatch(
      updateStore({
        id,
        name: editName,
        city: editCity,
        state: editStoreState,
      })
    );
    setEditRowId(null);
  };

  // Remove store
  const handleRemoveStore = (id: string) => {
    dispatch(removeStore(id));
  };

  // Reorder store using fromIndex, toIndex
  const handleMoveUp = (index: number) => {
    if (index > 0) {
      dispatch(reorderStore({ fromIndex: index, toIndex: index - 1 }));
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < stores.length - 1) {
      dispatch(reorderStore({ fromIndex: index, toIndex: index + 1 }));
    }
  };

  return (
    <div className="store-page">
      <h2 className="page-title">Stores</h2>

      <table className="store-table">
        <thead>
          <tr>
            <th>S. No</th>
            <th>Store</th>
            <th>City</th>
            <th>State</th>
            <th>Reorder</th>
            <th className="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store, index) => {
            const isEditing = editRowId === store.id;
            return (
              <tr key={store.id}>
                <td>{index + 1}</td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    store.name
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                    />
                  ) : (
                    store.city
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editStoreState}
                      onChange={(e) => setEditStoreState(e.target.value)}
                    />
                  ) : (
                    store.state
                  )}
                </td>
                {/* Reorder column */}
                <td style={{ textAlign: "center" }}>
                  <FaArrowUp
                    className={`icon-button move-icon ${
                      index === 0 ? "disabled-icon" : ""
                    }`}
                    title="Move Up"
                    onClick={() => handleMoveUp(index)}
                  />
                  <FaArrowDown
                    className={`icon-button move-icon ${
                      index === stores.length - 1 ? "disabled-icon" : ""
                    }`}
                    title="Move Down"
                    onClick={() => handleMoveDown(index)}
                  />
                </td>
                {/* Edit/Delete/Save/Cancel column */}
                <td style={{ textAlign: "center" }}>
                  {isEditing ? (
                    <>
                      <FaCheck
                        className="icon-button save-icon"
                        title="Save"
                        onClick={() => handleSaveEdit(store.id)}
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
                          handleEditClick(
                            store.id,
                            store.name,
                            store.city,
                            store.state
                          )
                        }
                      />
                      <FaTrash
                        className="icon-button delete-icon"
                        title="Delete"
                        onClick={() => handleRemoveStore(store.id)}
                      />
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Optional: Form to add new stores */}
      <div className="store-form">
        <input
          type="text"
          placeholder="Store Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="State"
          value={storeState}
          onChange={(e) => setStoreState(e.target.value)}
        />
        <button onClick={handleAddStore}>Add Store</button>
      </div>

    <DataImporter />
    </div>
  );
};

export default StorePage;
