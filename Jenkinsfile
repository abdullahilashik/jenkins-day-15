pipeline {
    agent any

    environment {
        GIT_USER = 'abdullahilashik'
        GIT_REPO = 'jenkins-day-15'
    }

    parameters {
        string(name: 'GIT_USER', defaultValue: 'abdullahilashik', description: 'Github username')
        string(name: 'GIT_REPO', defaultValue: 'jenkins-day-15', description: 'Github repository name')
        choice(name: 'BRANCH', choices: ['master','dev'], description: 'Select the branch to build')
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
                echo 'Optional git pull to see if SCS does the job!'
                // git 'https://github.com/abdullahilashik/jenkins-day-15.git'
                // git branch: "${BRANCH}", url: "https://github.com/${GIT_USER}/${GIT_REPO}.git"
            }
        }

        stage('decision') {
            steps {
                script {
                    if(params.BRANCH == 'master') {
                        echo 'Building the master branch....'
                    }
                    else if(params.BRANCH == 'dev') {
                        echo 'Building the dev branch....'
                    } else {
                        echo 'Invalid branch selected. Please choose either master or dev.'
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Build completed successfully!'
        }
        failure {
            echo 'Build failed. Check your email for details'
        }
        always {
            echo 'Cleaning up the workspace...'
            cleanWs()
        }
    }
}