import { Fragment, useState, useEffect } from "react";
import "./style.css";
import IconUpward from "assets/icons/arrowUpward.svg";
import IconDownward from "assets/icons/arrowDownward.svg";
import { getNormalizedDateString } from "helper";

const columns = [
  {
    id: 1,
    header: "Flight Number",
    value: "flightNumber",
  },
  {
    id: 2,
    header: "Airline",
    value: "airline",
  },
  {
    id: 3,
    header: "Destination",
    value: "destination",
  },
  {
    id: 4,
    header: "Scheduled Date",
    value: "scheduledDate",
  },
];

const flightsData = [
  {
    id: 1,
    flightNumber: "TK7227",
    airline: "Turkish Airlines",
    destination: "Gaziantep",
    scheduled: getNormalizedDateString("2020-10-11"),
    scheduledDate: "2020-10-11",
  },
  {
    id: 2,
    flightNumber: "PC4545",
    airline: "Pegasus",
    destination: "Gaziantep",
    scheduled: getNormalizedDateString("2018-05-10"),
    scheduledDate: "2018-05-10",
  },
  {
    id: 3,
    flightNumber: "XQ2424",
    airline: "SunExpress",
    destination: "İstanbul",
    scheduled: getNormalizedDateString("2021-03-05"),
    scheduledDate: "2021-03-05",
  },
  {
    id: 4,
    flightNumber: "TK7227",
    airline: "Turkish Airlines",
    destination: "Ankara",
    scheduled: getNormalizedDateString("2019-09-06"),
    scheduledDate: "2019-09-06",
  },
  {
    id: 5,
    flightNumber: "PC4342",
    airline: "Pegasus",
    destination: "İzmir",
    scheduled: getNormalizedDateString("2020-03-24"),
    scheduledDate: "2020-03-24",
  },
  {
    id: 6,
    flightNumber: "XQ9596",
    airline: "SunExpress",
    destination: "Gaziantep",
    scheduled: getNormalizedDateString("2020-03-25"),
    scheduledDate: "2020-03-25",
  },
  {
    id: 7,
    flightNumber: "TK7227",
    airline: "Turkish Airlines",
    destination: "Gaziantep",
    scheduled: getNormalizedDateString("2020-02-28"),
    scheduledDate: "2020-02-28",
  },
  {
    id: 8,
    flightNumber: "PC6343",
    airline: "Pegasus",
    destination: "Gaziantep",
    scheduled: getNormalizedDateString("2020-02-15"),
    scheduledDate: "2020-02-15",
  },
  {
    id: 9,
    flightNumber: "XQ3242",
    airline: "SunExpress",
    destination: "Gaziantep",
    scheduled: getNormalizedDateString("2020-03-12"),
    scheduledDate: "2020-03-12",
  },
  {
    id: 10,
    flightNumber: "PC6786",
    airline: "Pegasus",
    destination: "Gaziantep",
    scheduled: getNormalizedDateString("2020-03-26"),
    scheduledDate: "2020-03-26",
  },
];

//to drag and drop
document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("table");

  let draggingEle;
  let draggingColumnIndex;
  let placeholder;
  let list;
  let isDraggingStarted = false;

  // The current position of mouse relative to the dragging element
  let x = 0;
  let y = 0;

  // Swap two nodes
  const swap = (nodeA, nodeB) => {
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

    // Move `nodeA` to before the `nodeB`
    nodeB.parentNode.insertBefore(nodeA, nodeB);

    // Move `nodeB` to before the sibling of `nodeA`
    parentA.insertBefore(nodeB, siblingA);
  };

  // Check if `nodeA` is on the left of `nodeB`
  const isOnLeft = (nodeA, nodeB) => {
    // Get the bounding rectangle of nodes
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();

    return rectA.left + rectA.width / 2 < rectB.left + rectB.width / 2;
  };

  const cloneTable = () => {
    const rect = table.getBoundingClientRect();

    list = document.createElement("div");
    list.classList.add("clone-list");
    list.style.position = "absolute";
    list.style.left = `${rect.left}px`;
    list.style.top = `${rect.top}px`;
    table.parentNode.insertBefore(list, table);

    // Hide the original table
    table.style.visibility = "hidden";

    // Get all cells
    const originalCells = [].slice.call(table.querySelectorAll("tbody td"));

    const originalHeaderCells = [].slice.call(table.querySelectorAll("th"));
    const numColumns = originalHeaderCells.length;

    // Loop through the header cells
    originalHeaderCells.forEach((headerCell, headerIndex) => {
      const width = parseInt(window.getComputedStyle(headerCell).width);

      // Create a new table from given row
      const item = document.createElement("div");
      item.classList.add("draggable");

      const newTable = document.createElement("table");
      newTable.setAttribute("class", "clone-table");
      newTable.style.width = `${width}px`;

      // Header
      const th = headerCell.cloneNode(true);
      let newRow = document.createElement("tr");
      newRow.appendChild(th);
      newTable.appendChild(newRow);

      const cells = originalCells.filter((_c, idx) => {
        return (idx - headerIndex) % numColumns === 0;
      });
      cells.forEach((cell) => {
        const newCell = cell.cloneNode(true);
        newCell.style.width = `${width}px`;
        newRow = document.createElement("tr");
        newRow.appendChild(newCell);
        newTable.appendChild(newRow);
      });

      item.appendChild(newTable);
      list.appendChild(item);
    });
  };

  const mouseDownHandler = (e) => {
    draggingColumnIndex = [].slice
      .call(table.querySelectorAll("th"))
      .indexOf(e.target);

    // Determine the mouse position
    x = e.clientX - e.target.offsetLeft;
    y = e.clientY - e.target.offsetTop;

    // Attach the listeners to `document`
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  const mouseMoveHandler = (e) => {
    if (!isDraggingStarted) {
      isDraggingStarted = true;

      cloneTable();

      draggingEle = [].slice.call(list.children)[draggingColumnIndex];
      if (!draggingEle) return;
      draggingEle.classList.add("dragging");

      // Let the placeholder take the height of dragging element
      // So the next element won't move to the left or right
      // to fill the dragging element space
      placeholder = document.createElement("div");
      placeholder.classList.add("placeholder");
      draggingEle.parentNode.insertBefore(placeholder, draggingEle.nextSibling);
      placeholder.style.width = `${draggingEle.offsetWidth}px`;
    }

    if (!draggingEle) return;
    // Set position for dragging element
    draggingEle.style.position = "absolute";
    draggingEle.style.top = `${draggingEle.offsetTop + e.clientY - y}px`;
    draggingEle.style.left = `${draggingEle.offsetLeft + e.clientX - x}px`;

    // Reassign the position of mouse
    x = e.clientX;
    y = e.clientY;

    // The current order
    // prevEle
    // draggingEle
    // placeholder
    // nextEle
    const prevEle = draggingEle.previousElementSibling;
    const nextEle = placeholder.nextElementSibling;

    // // The dragging element is above the previous element
    // // User moves the dragging element to the left
    if (prevEle && isOnLeft(draggingEle, prevEle)) {
      // The current order    -> The new order
      // prevEle              -> placeholder
      // draggingEle          -> draggingEle
      // placeholder          -> prevEle
      swap(placeholder, draggingEle);
      swap(placeholder, prevEle);
      return;
    }

    // The dragging element is below the next element
    // User moves the dragging element to the bottom
    if (nextEle && isOnLeft(nextEle, draggingEle)) {
      // The current order    -> The new order
      // draggingEle          -> nextEle
      // placeholder          -> placeholder
      // nextEle              -> draggingEle
      swap(nextEle, placeholder);
      swap(nextEle, draggingEle);
    }
  };

  const mouseUpHandler = () => {
    // // Remove the placeholder
    if (!placeholder || !placeholder.parentNode) return;
    placeholder && placeholder.parentNode.removeChild(placeholder);

    draggingEle.classList.remove("dragging");
    draggingEle.style.removeProperty("top");
    draggingEle.style.removeProperty("left");
    draggingEle.style.removeProperty("position");

    // Get the end index
    const endColumnIndex = [].slice.call(list.children).indexOf(draggingEle);

    isDraggingStarted = false;

    // Remove the `list` element
    list.parentNode.removeChild(list);

    // Move the dragged column to `endColumnIndex`
    table.querySelectorAll("tr").forEach((row) => {
      const cells = [].slice.call(row.querySelectorAll("th, td"));
      draggingColumnIndex > endColumnIndex
        ? cells[endColumnIndex].parentNode.insertBefore(
            cells[draggingColumnIndex],
            cells[endColumnIndex]
          )
        : cells[endColumnIndex].parentNode.insertBefore(
            cells[draggingColumnIndex],
            cells[endColumnIndex].nextSibling
          );
    });

    // Bring back the table
    table.style.removeProperty("visibility");

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  };

  table.querySelectorAll("th").forEach((headerCell) => {
    headerCell.classList.add("draggable");
    headerCell.addEventListener("mousedown", mouseDownHandler);
  });
});

const style = {
  icon: {
    paddingLeft: 4,
    width: 12,
    height: 12,
  },
  number: {
    fontSize: 13,
  },
};

export default function FlightManagement() {
  const [sortedFlights, setSortedFlights] = useState([...flightsData]);
  const [selectedColumnList, setSelectedColumnList] = useState([]);

  //to sort (asc-desc)
  useEffect(() => {
    if (selectedColumnList.length === 0) return;
    const isDate = (date) => {
      return (
        date &&
        Object.prototype.toString.call(date) === "[object Date]" &&
        !isNaN(date)
      );
    };

    //to sort flights data
    const onSortFlights = (a, b) => {
      if (a === b) return 0;
      if (isDate(a) && isDate(b)) {
        return new Date(a) > new Date(b) ? 1 : -1;
      }
      return a < b ? -1 : 1;
    };

    //for asc-desc
    const onCompare = (reverse) => {
      let compare = onSortFlights;
      if (reverse) {
        return (a, b) => {
          return -1 * compare(a, b);
        };
      }
      return compare;
    };

    const onSortFlightsBy = () => {
      let fields = [];
      let field;
      let name;
      let compare;

      for (var i = 0; i < selectedColumnList.length; i++) {
        field = selectedColumnList[i];
        name = field.name;
        compare = onCompare(field.reverse);
        fields.push({
          name: name,
          compare: compare,
        });
      }

      return (A, B) => {
        let name;
        let compare;
        let result;
        for (var i = 0; i < selectedColumnList.length; i++) {
          result = 0;
          field = fields[i];
          name = field.name;
          compare = field.compare;

          result = compare(A[name], B[name]);
          if (result !== 0) break;
        }
        return result;
      };
    };
    let _flightsData = [...flightsData];
    _flightsData.sort(onSortFlightsBy());
    setSortedFlights(_flightsData);
  }, [selectedColumnList]);

  const columnFindIndex = (selectedColumnList, column) => {
    return selectedColumnList.findIndex((i) => i.name === column);
  };

  return (
    <div>
      <div className="container">
        <h1>FLIGHTS</h1>
      </div>
      <div className="container">
        <table id="table" className="table">
          <thead>
            <tr>
              {columns.map((item) => (
                <th
                  key={item.id}
                  onClick={() => {
                    let defaultColumn = {
                      name: item.value,
                      reverse: false,
                      icon: (
                        <img
                          src={IconUpward}
                          alt="IconUpward"
                          style={style.icon}
                        />
                      ),
                    };
                    let columnList = [...selectedColumnList];
                    if (columnList.length === 0) {
                      columnList = [defaultColumn];
                    } else {
                      let findIndex = columnFindIndex(columnList, item.value);
                      if (findIndex !== -1) {
                        columnList[findIndex].reverse = !columnList[findIndex]
                          .reverse;
                        columnList[findIndex].icon = !columnList[findIndex]
                          .reverse ? (
                          <img
                            src={IconUpward}
                            alt="IconUpward"
                            style={style.icon}
                          />
                        ) : (
                          <img
                            src={IconDownward}
                            alt="IconDownward"
                            style={style.icon}
                          />
                        );
                      } else {
                        columnList.push(defaultColumn);
                      }
                    }
                    setSelectedColumnList(columnList);
                  }}
                  onDoubleClick={() => {
                    if (selectedColumnList.length === 0) return;
                    if (selectedColumnList[0].name === item.value) {
                      setSelectedColumnList([]);
                      setSortedFlights([...flightsData]);
                    } else {
                      let filterColumnList = selectedColumnList.filter(
                        (i) => i.name !== item.value
                      );
                      setSelectedColumnList(filterColumnList);
                    }
                  }}
                >
                  {item.header}
                  {selectedColumnList?.length > 0 &&
                    selectedColumnList.map((i, index) => {
                      if (i.name === item.value) {
                        return (
                          <Fragment key={i.name}>
                            {i.icon}{" "}
                            <span style={style.number}>{index + 1 + "."}</span>
                          </Fragment>
                        );
                      } else return "";
                    })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedFlights.map((row) => (
              <tr key={row.id}>
                <td>{row.flightNumber}</td>
                <td>{row.airline}</td>
                <td>{row.destination}</td>
                <td>{row.scheduled}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
