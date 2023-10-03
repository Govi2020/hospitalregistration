import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./App.css";
import TopBar from "./components/TopBar";
import backend from "./entities/axios.js";

function App() {
    const [registrations, setRegistrations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterMenuOpen, setFilterMenuOpen] = useState(false);
    const [filter, setFilter] = useState("date");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const getRegistrations = async () => {
            try {
                console.log(backend);
                const response = await backend.get("hospitals/registrations");

                setRegistrations(response.data);
            } catch (error) {
                console.error("Error loading in:", error);
                toast.error("Cannot Get Hospital Registrations", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                });
            } finally {
                setIsLoading(false);
            }
        };

        getRegistrations();
    }, []);

    const changeFilter = (e) => {
        console.log(e.target);
        setFilter(e.target.attributes["data-name"].value);
    };

    return (
        <div>
            <TopBar />
            
            <div className="max-w-[1174px] px-[50px] py-6 mx-auto">
                <div className="flex justify-end ">
                    <img src="/service.png" alt="" />
                </div>
                <div className="bar flex items-center justify-between">
                    <h1 className="text-2xl">Hospital Registrations</h1>
                    <div className="flex items-center gap-4 ">
                        <div className="w-fit flex items-center h-10 shadow-lg px-4 py-1 gap-x-2 rounded-xl">
                            <input
                                type="text"
                                className="shrink-0 w-[400px] h-full outline-none border-none"
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                }}
                                value={search}
                            />
                            <img src="/search.svg" className="" alt="" />
                        </div>
                        <div
                            className="flex items-center justify-center aspect-square w-[40px] rounded-xl shadow-md cursor-pointer relative"
                            onClick={() => {
                                setFilterMenuOpen(!filterMenuOpen);
                            }}
                        >
                            <img src="/filter.svg" alt="" />
                            <div
                                className={`bg-white absolute top-[110%] w-[102px] h-[117px] shadow-[-2px_2px_2px_0px_rgba(0,0,0,0.10)] rounded-[5px] border-[0.5px] border-solid border-[#E0E0E0] z-10 items-center justify-center gap-y-3 flex-col ${
                                    filterMenuOpen ? "flex" : "hidden"
                                }`}
                            >
                                <span
                                    className="text-[#909090] text-base hover:text-[#393939] transition-all"
                                    data-name="date"
                                    onClick={changeFilter}
                                >
                                    Date
                                </span>
                                <span
                                    className="text-[#909090] text-base hover:text-[#393939] transition-all"
                                    data-name="active"
                                    onClick={changeFilter}
                                >
                                    Active
                                </span>
                                <span
                                    className="text-[#909090] text-base hover:text-[#393939] transition-all"
                                    data-name="inactive"
                                    onClick={changeFilter}
                                >
                                    Inactive
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registration Table */}
                {isLoading ? (
                    <div>Loading</div>
                ) : (
                    <div class="overflow-x-auto">
                        <table className="mt-6 w-full max-w-[1074px] overflow-scroll">
                            <thead>
                                <th>No.</th>
                                <th>Date & Time</th>
                                <th>Hospital Name</th>
                                <th>Email</th>
                                <th>Address</th>

                                <th>Phone Number</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Pincode</th>
                                <th>Hospital Registration Date</th>
                                <th>Hospital Registration Number</th>
                                <th>Hospital Registration Photo</th>
                                <th>Emergency-Ward Number</th>
                                <th className="last">Number of Ambulance</th>
                                <th className="bg-white">Status</th>
                            </thead>
                            <tbody>
                                {registrations
                                    .sort(function (a, b) {
                                        if (filter == "date") {
                                            return (
                                                new Date(b.registrationDate) -
                                                new Date(a.registrationDate)
                                            );
                                        } else if (filter == "active") {
                                            return b.isActive - a.isActive;
                                        } else if (filter == "inactive") {
                                            return a.isActive - b.isActive;
                                        }
                                    })
                                    .map((item, index) => {
                                        if (
                                            item.hospitalName
                                                .toLowerCase()
                                                .includes(search.toLowerCase())
                                        ) {
                                            return (
                                                <TableRow
                                                    item={item}
                                                    index={index}
                                                    setRegistrations={
                                                        setRegistrations
                                                    }
                                                />
                                            );
                                        }
                                    })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

const TableRow = ({ item, index, setRegistrations }) => {
    return (
        <tr>
            <td>{index}</td>
            <td>{item.registrationDate}</td>
            <td>{item.hospitalName}</td>
            <td>{item.email}</td>
            <td>{item.address}</td>
            <td>{item.number}</td>
            <td>{item.city}</td>
            <td>{item.state}</td>
            <td>{item.pincode}</td>
            <td>{item.registrationDate}</td>
            <td>{item.registrationNumber}</td>
            <td>
                <a
                    className="underline text-blue-600"
                    href={item.certificateUrl}
                >
                    File
                </a>
            </td>
            <td>{item.emergencyWard}</td>
            <td>{item.ambulanceAvail}</td>
            <td className="text-center">
                <ActiveButton
                    isActive={item.isActive}
                    item={item}
                    setRegistrations={setRegistrations}
                />
            </td>
        </tr>
    );
};

const ActiveButton = ({ isActive, item, setRegistrations }) => {
    const [isDropActive, setIsDropActive] = useState(false);
    const [isStatusActive, setIsStatusActive] = useState(isActive);
    const changeIsStatusActive = async (status) => {
        setIsStatusActive(status);
        try {
            // Change status Request
            const response = await backend.post("/hospitals/change-status", {
                hospitalID: item._id,
                status: status,
            });


            // Updating the Registrations list
            item.isActive = status;
            setRegistrations((prevRegistrations) => {
                const updatedRegistrations = [...prevRegistrations];
                const indexToUpdate = updatedRegistrations.findIndex(
                    (reg) => reg._id === item._id
                );

                if (indexToUpdate !== -1) {
                    updatedRegistrations[indexToUpdate] = item;
                }
                console.log(item)
                console.log(updatedRegistrations)

                return updatedRegistrations;
            });


            toast.success(response.data.message, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        } catch (error) {
            toast.error(error.response.data.message, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        }
    };

    return (
        <div
            className={`relative shadow-[3px_3px_4px_0px_rgba(0,0,0,0.25)] rounded-[15px] border-[0.5px] border-solid ${
                isActive
                    ? "bg-[#00d347] border-[#00B13C]"
                    : "border-[#AF2626] bg-[#FF5050]"
            } px-2 w-[105px] flex items-center gap-1 min-h-[30px] justify-center cursor-pointer`}
            onClick={() => {
                setIsDropActive(!isDropActive);
            }}
        >
            <img
                src="/clock.svg"
                className="w-[18px] aspect-square"
                alt=""
            />
            <span className="text-sm font-semibold">
                {isActive ? "Active" : "Inactive"}
            </span>
            <img
                src="/down-arrow.svg"
                alt=""
                className="w-[18px] aspect-square"
            />
            <div
                className={`absolute top-[110%] z-10 w-[130px] h-[120px] rounded-lg bg-white shadow-[4px_4px_10px_0px_rgba(0,0,0,0.15)] flex-col items-center justify-center gap-y-2 ${
                    isDropActive ? "flex" : "hidden"
                }`}
            >
                <img
                    src="/down-arrow.svg"
                    alt=""
                    className="w-[30px] aspect-square"
                />
                <div
                    className="shadow-[3px_3px_4px_0px_rgba(0,0,0,0.25)] rounded-[15px] border-[0.5px] border-solid border-[#AF2626] bg-[#FF5050] px-2 w-[105px] flex items-center gap-1 min-h-[30px] justify-center cursor-pointer mx-ato"
                    onClick={() => {
                        changeIsStatusActive(false);
                    }}
                >
                    <img
                        src="/clock.svg"
                        className="w-[18px] aspect-square"
                        alt=""
                    />
                    <span className="text-sm font-semibold">Inactive</span>
                    <img
                        src="/down-arrow.svg"
                        alt=""
                        className="w-[18px] aspect-square"
                    />
                </div>
                <div
                    className="shadow-[3px_3px_4px_0px_rgba(0,0,0,0.25)] rounded-[15px] border-[0.5px] border-solid bg-[#00d347] border-[#00B13C] px-2 w-[105px] flex items-center gap-1 min-h-[30px] justify-center cursor-pointer mx-ato"
                    onClick={() => {
                        changeIsStatusActive(true);
                    }}
                >
                    <img
                        src="/clock.svg"
                        className="w-[18px] aspect-square"
                        alt=""
                    />
                    <span className="text-sm font-semibold">Active</span>
                    <img
                        src="/down-arrow.svg"
                        alt=""
                        className="w-[18px] aspect-square"
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
