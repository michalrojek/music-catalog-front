import Base from './components/Base.jsx';
import HomePage from './components/HomePage.jsx';
import LoginPage from './containers/LoginPage.jsx';
import SignUpPage from './containers/SignUpPage.jsx';
import PaginationPage from './containers/PaginationPage.jsx';
import AlbumInfoPage from './components/AlbumInfoPage.jsx';
import ArtistInfoPage from './components/ArtistInfoPage.jsx';
import AddArtist from './components/AddArtist.jsx';
import AddBand from './components/AddBand.jsx';
import AddAlbum from './components/AddAlbum.jsx';
import AddList from './components/AddList.jsx';
import UserLists from './components/UserLists.jsx';
import ListInfoPage from './components/ListInfoPage.jsx';
import EditUserList from './components/EditUserList.jsx';
import AddGenre from './components/AddGenre.jsx';
import AddEdition from './components/AddEdition.jsx';
import AddAlbumType from './components/AddAlbumType.jsx';

const routes = {
    //base component (wrapper for the whole application).
    component: Base,
    childRoutes: [

        {
            path: '/',
            component: HomePage
        },

        {
            path: '/login',
            component: LoginPage
        },

        {
            path: '/signup',
            component: SignUpPage
        },

        {
            path: '/artists',
            component: PaginationPage
        },

        {
            path: '/artists/:id',
            component: ArtistInfoPage
        },

        {
            path: '/lists',
            component: PaginationPage
        },

        {
            path: '/lists/:id',
            component: ListInfoPage
        },

        {
            path: '/albums',
            component: PaginationPage
        },

        {
            path: '/albums/:id',
            component: AlbumInfoPage
        },

        {
            path: '/addartist',
            component: AddArtist
        },

        {
            path: '/addband',
            component: AddBand
        },
        
        {
            path: '/addalbum',
            component: AddAlbum
        },
        
        {
            path: '/addlist',
            component: AddList
        },

        {
            path: '/addgenre',
            component: AddGenre
        },

        {
            path: '/addedition',
            component: AddEdition
        },
        
        {
            path: '/addalbumtype',
            component: AddAlbumType
        },

        {
            path: '/mylists',
            component: UserLists
        },
        
        {
            path: '/mylists/id/:id',
            component: EditUserList
        }
    ]
};

export default routes;