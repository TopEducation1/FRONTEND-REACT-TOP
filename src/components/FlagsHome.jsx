import  { useNavigate } from 'react-router-dom';

const FlagsHome = ({ university, image, tag }) => {

    const navigate = useNavigate();

    const worldUniversities = [
        { university: "University of Toronto", image: "/assets/flags/University+of+Toronto.png", tag: "University of Toronto" },
        { university: "University of Michigan", image: "/assets/flags/University+of+Michigan.png", tag: "University of Michigan" },
        { university: "Columbia University", image: "/assets/flags/Columbia+university+flag.png", tag: "Columbia University" },
        { university: "Peking University", image: "/assets/flags/Peking+university.png", tag: "Peking University" },
        { university: "Berklee University", image: "/assets/flags/Berklee+university+flag.png", tag: "Berklee University" },
        { university: "Harvard University", image: "/assets/flags/Harvard+university+flag.png", tag: "Harvard University" },
        { university: "MIT", image: "/assets/flags/MIT+University+flag.png", tag: "MIT" },
        { university: "University of Pennsylvania", image: "/assets/flags/University+of+Penn.png", tag: "University of Pennsylvania" },
        { university: "Stanford University", image: "/assets/flags/Stanford+university+flag+1.png", tag: "Stanford University" },
        { university: "University of Chicago", image: "/assets/flags/The+university+of+chicago.png", tag: "University of Chicago" },
        { university: "Yale University", image: "/assets/flags/Yale+university+flag.png", tag: "Yale University" }
    ];

    const hispanicUniversities = [
        { university: "Universidad Anáhuac", image: "/assets/flags/Anáhuac.png", tag: "Universidad Anáhuac" },
        { university: "IESE Business School", image: "/assets/flags/IESE+Business+School+University+of+Navarre.png", tag: "IESE Business School" },
        { university: "Universidad de Palermo", image: "/assets/flags/UP+universidad+de+palermo.png", tag: "Universidad de Palermo" },
        { university: "Universidad de los Andes", image: "/assets/flags/universidad+de+los+andes.png", tag: "Universidad de los Andes" },
        { university: "Universidad Autónoma de Barcelona", image: "/assets/flags/Universitat+Autónoma+de+Barcelona.png", tag: "UAB" },
        { university: "IE Business School", image: "/assets/flags/ie+business+school.png", tag: "IE Business School" },
        { university: "Pontificia Universidad Católica de Chile", image: "/assets/flags/Pontificia+Universidad+Catolica+De+Chile.png", tag: "PUC" },
        { university: "Universitat de Barcelona", image: "/assets/flags/Universitat+de+Barcelona.png", tag: "UB" },
        { university: "Universidad Nacional de Colombia", image: "/assets/flags/Universidad+Nacional+De+Colombia+.png", tag: "UNAL" },
        { university: "Tecnológico de Monterrey", image: "/assets/flags/Tecnológico+de+Monterrey.png", tag: "Tec de Monterrey" },
        { university: "Universidad Nacional Autónoma de México", image: "/assets/flags/Universidad+Nacional+Autónoma+de+México.png", tag: "UNAM" }
    ];


    const handleUniversityClick = (tag) => {

        const initialTags = {
            "Universidad": [tag]
        };

        navigate('/library', {
            state: {selectedTags: initialTags},
            replace: true
        });
    };

    const Flag = ({ university, image, tag }) => (
        <img 
            src={image} 
            alt={university}
            onClick={() => handleUniversityClick(tag)}
            title={university}
        />
    );

    return (
        <div id="fourth-home-section">
            <h2>Aprende con las universidades líderes del mundo</h2>
            <div id="fourth-flags-upper">
            <img src="/assets/Piezas/InternationalFlags.svg"/>
            </div>

            <h2>y de habla hispana</h2>
            <div id="fourth-flags-lower">
                <img src="/assets/Piezas/LatamFlags.svg"/>
            </div>
        </div>
    );
};

export default FlagsHome;