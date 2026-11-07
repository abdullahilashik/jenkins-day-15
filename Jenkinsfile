pipeline {
    agent any

    environment {
        GIT_USER = 'abdullahilashik'
        GIT_REPO = 'jenkins-day-15'
    }

    stages {

        stage('Prepare') {
            steps {
                cleanWs()
                echo "Preparing the workspace for ${GIT_USER}/${GIT_REPO}"
            }
        }
        stage('Commit') {
            steps {
                git 'https://github.com/abdullahilashik/jenkins-day-15.git'
            }
        }        
    }
}