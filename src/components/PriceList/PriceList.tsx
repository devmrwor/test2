import React, { useState, ChangeEvent, useCallback, useEffect } from "react";
import { IconButton, TextField } from "@mui/material";
import { RemoveCircleOutline, Edit, Save } from "@mui/icons-material";
import { Label } from "../primitives/Label/Label";
import { useTranslation } from "next-i18next";
import { AddCircleIcon, EditIcon, PenEditIcon, PenEditIconXl } from "../Icons/Icons";

interface Service {
  id: number;
  name: string;
  price: number;
  isEditing: boolean;
}

interface PriceListProps {
  onChange: (services: Service[]) => void;
  isEditing?: boolean;
  value: Service[];
}

const PriceList: React.FC<PriceListProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>(value);
  const [newService, setNewService] = useState<string>("");
  const [newPrice, setNewPrice] = useState<string>("");
  const [isEditingEnabled, setIsEditingEnabled] = useState<boolean>(false);
  const [isAllShowed, setIsAllShowed] = useState<boolean>(false);

  useEffect(() => {
    setServices(value);
  }, [value]);

  const handleAddService = useCallback(() => {
    if (!newService || !newPrice) return;
    const newId = services.length > 0 ? services[services.length - 1].id + 1 : 1;
    const newServiceObj = {
      id: newId,
      name: newService,
      price: parseFloat(newPrice),
      isEditing: false,
    };
    const updatedServices = [...services, newServiceObj];
    setServices(updatedServices);
    setNewService("");
    setNewPrice("");
    onChange(updatedServices);
  }, [newService, newPrice, services, onChange]);

  const handleRemoveService = useCallback(
    (id: number) => {
      const updatedServices = services.filter((service) => service.id !== id);
      setServices(updatedServices);
      onChange(updatedServices);
    },
    [services, onChange]
  );

  const handleEditToggle = useCallback(
    (id: number) => {
      setServices(
        services.map((service) =>
          service.id === id ? { ...service, isEditing: !service.isEditing } : service
        )
      );
    },
    [services]
  );

  const handleServiceChange = useCallback(
    (id: number, value: string) => {
      setServices(
        services.map((service) => (service.id === id ? { ...service, name: value } : service))
      );
    },
    [services]
  );

  const handlePriceChange = useCallback(
    (id: number, value: string) => {
      setServices(
        services.map((service) =>
          service.id === id ? { ...service, price: parseFloat(value) } : service
        )
      );
    },
    [services]
  );

  const handleSave = useCallback(
    (id: number) => {
      handleEditToggle(id);
      onChange(services);
    },
    [handleEditToggle, services, onChange]
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="font-medium text-lg text-text-primary">{t("pricelist")}</p>
        {!isEditingEnabled && (
          <button
            onClick={() => setIsEditingEnabled(true)}
            className="text-primary-100 fill-primary-100 flex items-center gap-2"
            type="button"
          >
            <PenEditIconXl fill="currentColor" /> <span>{t("edit")}</span>
          </button>
        )}
      </div>
      {isEditingEnabled ? (
        <div className="py-2">
          <div className="flex mb-4">
            <div className="flex gap-3">
              <TextField
                label={t("service")}
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                className="mr-2 flex-grow"
                variant="outlined"
                size="small"
              />
              <TextField
                label={t("price")}
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="mr-2 flex-grow"
                variant="outlined"
                size="small"
                type="number"
              />
            </div>
            <IconButton color="primary" onClick={handleAddService}>
              <AddCircleIcon />
            </IconButton>
          </div>
          <ul>
            {services.map((service) => (
              <li key={service.id} className="flex items-center mb-2 text-text-primary">
                {service.isEditing ? (
                  <>
                    <div className="flex gap-2 items-center">
                      <TextField
                        label={t("service")}
                        value={service.name}
                        onChange={(e) => handleServiceChange(service.id, e.target.value)}
                        className="mr-2 flex-grow"
                        variant="outlined"
                        size="small"
                      />
                      <TextField
                        label={t("price")}
                        value={service.price}
                        onChange={(e) => handlePriceChange(service.id, e.target.value)}
                        className="mr-2 flex-grow"
                        variant="outlined"
                        size="small"
                        type="number"
                      />
                    </div>
                    <IconButton color="primary" onClick={() => handleSave(service.id)}>
                      <Save />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <span className="flex-grow">
                      {service.name} - {service.price.toFixed(2)}
                    </span>
                    <IconButton color="primary" onClick={() => handleEditToggle(service.id)}>
                      <Edit />
                    </IconButton>
                  </>
                )}
                <IconButton color="error" onClick={() => handleRemoveService(service.id)}>
                  <RemoveCircleOutline />
                </IconButton>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="py-2">
          <ul>
            {services.map((service, index) => {
              if (!isAllShowed && index > 2) return <></>;
              return (
                <li key={service.id} className="flex items-center mb-2">
                  <div className="flex-grow text-text-primary flex items-center justify-between">
                    <span>{service.name}</span> <span>{service.price.toFixed(2)}</span>
                  </div>
                </li>
              );
            })}
          </ul>
          {services.length > 3 && (
            <button
              onClick={() => setIsAllShowed((prev) => !prev)}
              className="text-text-secondary fill-text-secondary flex items-center gap-2"
              type="button"
            >
              <span>{!isAllShowed ? t("more") : t("less")}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PriceList;
