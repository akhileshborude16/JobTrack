// ========================================
// JOBTRACK V1
// Job Application Tracker
// ========================================


// ========================================
// GET HTML ELEMENTS
// ========================================

const openModalBtn = document.getElementById("openModalBtn");

const emptyAddBtn = document.getElementById("emptyAddBtn");

const modalOverlay = document.getElementById("modalOverlay");

const closeModalBtn = document.getElementById("closeModalBtn");

const cancelBtn = document.getElementById("cancelBtn");

const applicationForm =
    document.getElementById("applicationForm");

const applicationsTable =
    document.getElementById("applicationsTable");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");


// Form inputs

const applicationId =
    document.getElementById("applicationId");

const companyInput =
    document.getElementById("company");

const positionInput =
    document.getElementById("position");

const dateInput =
    document.getElementById("date");

const statusInput =
    document.getElementById("status");

const jobLinkInput =
    document.getElementById("jobLink");

const modalTitle =
    document.getElementById("modalTitle");


// Statistics

const totalApplications =
    document.getElementById("totalApplications");

const appliedApplications =
    document.getElementById("appliedApplications");

const interviewApplications =
    document.getElementById("interviewApplications");

const selectedApplications =
    document.getElementById("selectedApplications");

const rejectedApplications =
    document.getElementById("rejectedApplications");


// ========================================
// APPLICATION DATA
// ========================================

let applications = [];


// ========================================
// LOAD DATA
// ========================================

function loadApplications() {

    const savedApplications =
        localStorage.getItem("jobApplications");

    if (savedApplications) {

        try {

            applications =
                JSON.parse(savedApplications);

        } catch (error) {

            applications = [];

            console.log(
                "Could not load saved applications."
            );

        }

    }

}


// ========================================
// SAVE DATA
// ========================================

function saveApplications() {

    localStorage.setItem(
        "jobApplications",
        JSON.stringify(applications)
    );

}


// ========================================
// OPEN MODAL
// ========================================

function openModal() {

    modalOverlay.classList.add("active");

}


// ========================================
// CLOSE MODAL
// ========================================

function closeModal() {

    modalOverlay.classList.remove("active");

    applicationForm.reset();

    applicationId.value = "";

    modalTitle.textContent =
        "Add Application";

}


// ========================================
// DISPLAY APPLICATIONS
// ========================================

function displayApplications() {

    applicationsTable.innerHTML = "";


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedStatus =
        statusFilter.value;


    const filteredApplications =
        applications.filter(function(app) {

            const company =
                app.company.toLowerCase();

            const position =
                app.position.toLowerCase();


            const matchesSearch =
                company.includes(searchText) ||
                position.includes(searchText);


            const matchesStatus =
                selectedStatus === "all" ||
                app.status === selectedStatus;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    // No applications

    if (filteredApplications.length === 0) {

        emptyState.style.display = "block";

        return;

    }


    emptyState.style.display = "none";


    // Create rows

    filteredApplications.forEach(function(app) {

        const row =
            document.createElement("tr");


        let jobLink = "—";


        if (app.jobLink) {

            jobLink = `
                <a
                    href="${app.jobLink}"
                    target="_blank"
                    class="job-link"
                >
                    View Job
                </a>
            `;

        }


        row.innerHTML = `

            <td>
                <strong>
                    ${app.company}
                </strong>
            </td>

            <td>
                ${app.position}
            </td>

            <td>
                ${formatDate(app.date)}
            </td>

            <td>

                <span
                    class="status status-${app.status.toLowerCase()}"
                >
                    ${app.status}
                </span>

            </td>

            <td>
                ${jobLink}
            </td>

            <td>

                <div class="action-buttons">

                    <button
                        class="action-btn edit-btn"
                        type="button"
                        data-id="${app.id}"
                        onclick="editApplication('${app.id}')"
                    >
                        ✏️
                    </button>

                    <button
                        class="action-btn delete-btn"
                        type="button"
                        data-id="${app.id}"
                        onclick="deleteApplication('${app.id}')"
                    >
                        🗑️
                    </button>

                </div>

            </td>

        `;


        applicationsTable.appendChild(row);

    });

}


// ========================================
// ADD / EDIT APPLICATION
// ========================================

applicationForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const id =
            applicationId.value;


        const newApplication = {

            id:
                id ||
                Date.now().toString(),

            company:
                companyInput.value.trim(),

            position:
                positionInput.value.trim(),

            date:
                dateInput.value,

            status:
                statusInput.value,

            jobLink:
                jobLinkInput.value.trim()

        };


        // EDIT

        if (id) {

            applications =
                applications.map(
                    function(app) {

                        if (app.id === id) {

                            return newApplication;

                        }

                        return app;

                    }
                );

        }

        // ADD

        else {

            applications.push(
                newApplication
            );

        }


        saveApplications();

        displayApplications();

        updateStatistics();

        closeModal();

    }
);


// ========================================
// EDIT APPLICATION
// ========================================

function editApplication(id) {

    const app =
        applications.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!app) {

        return;

    }


    applicationId.value =
        app.id;

    companyInput.value =
        app.company;

    positionInput.value =
        app.position;

    dateInput.value =
        app.date;

    statusInput.value =
        app.status;

    jobLinkInput.value =
        app.jobLink;


    modalTitle.textContent =
        "Edit Application";


    openModal();

}


// ========================================
// DELETE APPLICATION
// ========================================

function deleteApplication(id) {

    const shouldDelete =
        confirm(
            "Are you sure you want to delete this application?"
        );


    if (!shouldDelete) {

        return;

    }


    applications =
        applications.filter(
            function(app) {

                return app.id !== id;

            }
        );


    saveApplications();

    displayApplications();

    updateStatistics();

}


// ========================================
// UPDATE STATISTICS
// ========================================

function updateStatistics() {

    totalApplications.textContent =
        applications.length;


    appliedApplications.textContent =
        applications.filter(
            function(app) {

                return app.status === "Applied";

            }
        ).length;


    interviewApplications.textContent =
        applications.filter(
            function(app) {

                return app.status === "Interview";

            }
        ).length;


    selectedApplications.textContent =
        applications.filter(
            function(app) {

                return app.status === "Selected";

            }
        ).length;


    rejectedApplications.textContent =
        applications.filter(
            function(app) {

                return app.status === "Rejected";

            }
        ).length;

}


// ========================================
// FORMAT DATE
// ========================================

function formatDate(date) {

    if (!date) {

        return "—";

    }


    const formattedDate =
        new Date(
            date + "T00:00:00"
        );


    return formattedDate.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ========================================
// SEARCH
// ========================================

searchInput.addEventListener(
    "input",
    function() {

        displayApplications();

    }
);


// ========================================
// FILTER
// ========================================

statusFilter.addEventListener(
    "change",
    function() {

        displayApplications();

    }
);


// ========================================
// OPEN MODAL BUTTON
// ========================================

openModalBtn.addEventListener(
    "click",
    function() {

        openModal();

    }
);


// ========================================
// EMPTY STATE BUTTON
// ========================================

emptyAddBtn.addEventListener(
    "click",
    function() {

        openModal();

    }
);


// ========================================
// CLOSE BUTTON
// ========================================

closeModalBtn.addEventListener(
    "click",
    function() {

        closeModal();

    }
);


// ========================================
// CANCEL BUTTON
// ========================================

cancelBtn.addEventListener(
    "click",
    function() {

        closeModal();

    }
);


// ========================================
// CLOSE MODAL BY CLICKING OUTSIDE
// ========================================

modalOverlay.addEventListener(
    "click",
    function(event) {

        if (event.target === modalOverlay) {

            closeModal();

        }

    }
);


// ========================================
// START APPLICATION
// ========================================

loadApplications();

displayApplications();

updateStatistics();
